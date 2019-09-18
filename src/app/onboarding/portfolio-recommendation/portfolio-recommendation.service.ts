import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Allocation, Answer, ClientResponse, DecigionNode, ModelHolding, NodeRelationship, Question, Securitie} from '../onboarding';
import {OnboardingService} from '../onboarding.service';
import {QuestionnaireService} from '../questionnaire/questionnaire.service';

const timeHorizonQuestionId = '6f04bfb3-02b6-4716-bea4-90b545129d89';
const riskProfileQuestionId = 'caef1b6a-e2cc-4325-abd8-b20e1f978ff8';

@Injectable({
  providedIn: 'root'
})
export class PortfolioRecommendationService {
  private clientResponses: ClientResponse[];
  private nodes: DecigionNode[];
  private nodeRelationship: NodeRelationship[];
  finalNodeId = '427aca5b-9ea1-4a5f-8594-ee5f11ce4a75';
  suggestedModelHolding: ModelHolding[];
  suggestedSecurities: Securitie[];
  private suggestedAllocation: Allocation;
  // finalNodeId: string;

  constructor(
    private http: HttpClient,
    private onboardingService: OnboardingService,
    private questionnaireService: QuestionnaireService
  ) { }

  getNodesList() {
    const url = `${environment.apiUrl}/nucleus/v1/node`;

    return this.http.get(url).toPromise()
      .then((data: {content: DecigionNode[]}) => {
        this.nodes = data.content;
      });
  }

  getNodeRelationship() {
    const url = `${environment.apiUrl}/nucleus/v1/node_relationship`;

    return this.http.get(url).toPromise()
      .then((data: {content: NodeRelationship[]}) => {
        this.nodeRelationship = data.content;
      });
  }

  getSuggestedAllocation() {
    return Promise.all([this.getNodesList(), this.getNodeRelationship(), this.questionnaireService.getClientResponsesList()])
      .then(() => {
        const firstNone = this.nodes.find(n => n.is_first);
        this.finalNodeId = this.decisionAlgorithm(firstNone.id);
        return this.finalNodeId;
      })
      .then(() => {
        return this.onboardingService.getAllocationByNodeId(this.finalNodeId);
      })
      .then((data: {content: Allocation[]}) => {
        this.suggestedAllocation = data.content[0];
      });
  }

  private decisionAlgorithm(questionId) {
    const relationshipNodes = this.nodeRelationship.filter(a => a.node_parent_id === questionId);
    const answerNodeRelationship  = relationshipNodes.find((a: NodeRelationship) => {
      return !!this.questionnaireService.clientResponses.find((r: ClientResponse) => (r.answer_id === a.answer_id));
    });

    if (answerNodeRelationship.is_leaf) {
      return answerNodeRelationship.node_child_id;
    } else {
      return this.decisionAlgorithm(answerNodeRelationship.node_child_id);
    }
  }

  // TODO need to change this logic to use "secondary_id" and avoid loading questionnaire
  getTimeHorizonAnswer(questions: Question[]): Answer {
    const question = questions.find(q => q.id === timeHorizonQuestionId);

    return question.answers.find(a => {
      return !!this.questionnaireService.clientResponses.find(c => c.answer_id === a.id);
    });
  }

  getTimeRiskProfileAnswer(questions: Question[]): Answer {
    const question = questions.find(q => q.id === riskProfileQuestionId);

    return question.answers.find(a => {
      return !!this.questionnaireService.clientResponses.find(c => c.answer_id === a.id);
    });
  }

  getAllocationCompositionByAllocationId(allocationId) {
    const url = `${environment.apiUrl}/nucleus/v1/allocation_composition?filter=allocation_id==${allocationId}`;

    return this.http.get(url).toPromise()
      .then((data: any) => {
        return data.content;
      });
  }

  getModelHoldingByModelId(modelId) {
    const url = `${environment.apiUrl}/nucleus/v1/model_holding?filter=model_id==${modelId}`;

    return this.http.get(url).toPromise()
      .then((data: any) => {
        return data.content;
      });
  }

  getSuggestedModelHolding(allocationId): Promise<ModelHolding[]> {
    return this.getAllocationCompositionByAllocationId(allocationId)
            .then(data => {
              const allocationCompositions = data[0];

              return this.getModelHoldingByModelId(allocationCompositions.model_id);
            })
      .then((data: ModelHolding[]) => {
        this.suggestedModelHolding = data;

        return this.suggestedModelHolding;
      });
  }

  getSecurity(securityId): Promise<Securitie> {
    const url = `${environment.apiUrl}/nucleus/v1/security/${securityId}`;

    return this.http.get(url).toPromise()
      .then((data: Securitie) => data);
  }

  getSecuritiesAllocationData(allocationId): Promise<{modelHolding: ModelHolding[], securities: Securitie[]}> {
    return this.getSuggestedModelHolding(allocationId)
      .then(() => {
        const securityPromises = this.suggestedModelHolding.map(m => {
          return this.getSecurity(m.security_id);
        });

        return Promise.all(securityPromises);
      })
      .then((securities: Securitie[]) => {
        this.suggestedSecurities = securities;

        return {
          modelHolding: this.suggestedModelHolding,
          securities: this.suggestedSecurities,
        };
      });
  }

  getResultPageData() {
    return this.getSuggestedAllocation()
      .then(() => {
        return this.getSecuritiesAllocationData(this.suggestedAllocation.id);
      })
      .then((data) => {
        return data.modelHolding.map((m) => {
          const security = data.securities.find(s => s.id === m.security_id);
          return {
            strategic_weight: m.strategic_weight,
            securityName: security.name,
            ticker: security.ticker,
          };
        });
      });
  }

}
