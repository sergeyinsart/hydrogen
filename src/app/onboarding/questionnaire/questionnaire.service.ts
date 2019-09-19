import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ClientResponse} from '../onboarding';

const questionnaireId = '323bc440-dd80-4d5f-b886-3fb8683460c9';

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
