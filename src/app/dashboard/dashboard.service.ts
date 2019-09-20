import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {PortfolioRecommendationService} from '../onboarding/portfolio-recommendation/portfolio-recommendation.service';

export interface AssetClass {
  name: string;
  asset_class: string;
  ticker: string;
  weight: number;
  balance?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
      private http: HttpClient,
      private portfolioRecommendationService: PortfolioRecommendationService
    ) { }

  getHoldings(accountId) {
    const url = `${environment.apiUrl}/nucleus/v1/portfolio_holding?filter=portfolio_id==${accountId}`;

    return this.http.get(url).toPromise()
      .then((data: any) => {
        return data.content;
      });
  }

  getAssetSize(accountId) {
    const url = `${environment.apiUrl}/nucleus/v1/account/${accountId}/asset_size`;

    return this.http.get(url).toPromise()
      .then((assets) => {
        return assets && assets[0];
      });
  }

  getDashboardAllocationData(holdings): Promise<AssetClass[]> {
    const securitiesPromises = holdings.map(h => {
      return this.portfolioRecommendationService.getSecurity(h.security_id);
    });

    return Promise.all(securitiesPromises)
      .then((securities: any) => {
        return securities.map(s => {
          return {
            name: s.name,
            asset_class: s.asset_class,
            ticker: s.ticker,
            weight: holdings.find(h => h.security_id === s.id).weight
          };
        });
      });
  }

  calculateBalance(holding, totalBalance) {
    return totalBalance * holding.weight / 100;
  }
}
