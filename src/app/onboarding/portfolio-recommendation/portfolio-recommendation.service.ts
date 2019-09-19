import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Allocation, ClientResponse, DecigionNode, ModelHolding, NodeRelationship, Securitie} from '../onboarding';
import {OnboardingService} from '../onboarding.service';
import {QuestionnaireService} from '../questionnaire/questionnaire.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioRecommendationService {
  private nodes: DecigionNode[];
  private nodeRelationship: NodeRelationship[];
  suggestedModelHolding: ModelHolding[];
  suggestedSecurities: Securitie[];
  suggestedAllocation: Allocation;
  finalNodeId: string;

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

  getTimeHorizonResponse(): ClientResponse {
    return this.questionnaireService.clientResponses.find(q => q.secondary_id === 'timeHorizon');
  }

  getTimeRiskProfileResponse(): ClientResponse {
    return this.questionnaireService.clientResponses.find(q => q.secondary_id === 'riskProfile');
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
            weight: m.current_weight,
            securityName: security.name,
            ticker: security.ticker,
            securityId: security.id,
          };
        });
      });
  }

  subscribeAccount(accountId, allocationId) {
    const url = `${environment.apiUrl}/nucleus/v1/account/${accountId}/subscribe`;

    const data = {
      current_weight: 100,
      strategic_weight: 100,
      date: new Date(),
      allocation_id: allocationId
    };

    return this.http.post(url, data).toPromise();
  }

  createAssetSize(portfolioId) {
    const url = `${environment.apiUrl}/nucleus/v1/portfolio_asset_size`;

    const data = {
      date: new Date(),
      asset_size: 10000,
      cash_flow: 10000,
      portfolio_id: portfolioId
    };

    return this.http.post(url, data).toPromise();
  }

  createPortfolioHoldings(portfolioId, securityId, weight) {
    const url = `${environment.apiUrl}/nucleus/v1/portfolio_holding`;

    const data = {
      date: new Date(),
      portfolio_id: portfolioId,
      security_id: securityId,
      shares: 1,
      weight
    };

    return this.http.post(url, data).toPromise();
  }

}
