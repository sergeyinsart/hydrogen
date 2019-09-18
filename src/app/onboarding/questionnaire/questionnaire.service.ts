import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ClientResponse, NodeRelationship} from '../onboarding';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private clientResponses: ClientResponse[];
  private nodes: Node;
  private nodeRelationship: NodeRelationship;

  constructor(private http: HttpClient) { }

  getClientResponsesList() {
    const url = `${environment.apiUrl}/nucleus/v1/model`;

    return this.http.get(url).toPromise()
      .then((data: {content: ClientResponse[]}) => {
        this.clientResponses = data.content;

        return this.clientResponses;
      });
  }

  getNodesList() {
    const url = `${environment.apiUrl}/nucleus/v1/node`;

    return this.http.get(url).toPromise()
      .then((data: {content: Node}) => {
        this.nodes = data.content;
      });
  }

  getNodeRelationship() {
    const url = `${environment.apiUrl}/nucleus/v1/node_relationship`;

    return this.http.get(url).toPromise()
      .then((data: {content: NodeRelationship}) => {
        this.nodeRelationship = data.content;
      });
  }

}
