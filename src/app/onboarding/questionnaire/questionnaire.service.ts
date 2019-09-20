import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ClientResponse} from '../onboarding';

const questionnaireId = 'b87dbd6a-2422-45d2-961b-759a8442e570';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  clientResponses: ClientResponse[];

  constructor(private http: HttpClient) { }

  getQuestions() {
    const url = `${environment.apiUrl}/nucleus/v1/questionnaire/${questionnaireId}`;

    return this.http.get(url).toPromise();
  }

  createClientResponse(clientResponse: ClientResponse) {
    const url = `${environment.apiUrl}/nucleus/v1/client_response`;

    return this.http.post(url, clientResponse).toPromise();
  }

  getClientResponsesList() {
    const url = `${environment.apiUrl}/nucleus/v1/client_response`;

    return this.http.get(url).toPromise()
      .then((data: {content: ClientResponse[]}) => {
        this.clientResponses = data.content;

        return this.clientResponses;
      });
  }
}
