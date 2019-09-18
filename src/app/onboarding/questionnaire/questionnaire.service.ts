import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ClientResponse, DecigionNode, NodeRelationship} from '../onboarding';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private clientResponses: ClientResponse[];
  private nodes: DecigionNode[];
  private nodeRelationship: NodeRelationship[];
  suggestedAllocationId: string;

  constructor(private http: HttpClient) { }

  getClientResponsesList() {
    const url = `${environment.apiUrl}/nucleus/v1/client_response`;

    return this.http.get(url).toPromise()
      .then((data: {content: ClientResponse[]}) => {
        this.clientResponses = data.content;

        return this.clientResponses;
      });
  }

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

  defineAllocation() {
    const firstNone = this.nodes.find(n => n.is_first);

    this.suggestedAllocationId = this.decisionAlgorithm(firstNone.id);
  }

  private decisionAlgorithm(questionId) {
    const relationshipNodes = this.nodeRelationship.filter(a => a.node_parent_id === questionId);
    const answerNodeRelationship  = relationshipNodes.find((a: NodeRelationship) => {
      return !!this.clientResponses.find((r: ClientResponse) => (r.answer_id === a.answer_id));
    });

    if (answerNodeRelationship.is_leaf) {
      return answerNodeRelationship.node_child_id;
    } else {
      return this.decisionAlgorithm(answerNodeRelationship.node_child_id);
    }
  }

}
