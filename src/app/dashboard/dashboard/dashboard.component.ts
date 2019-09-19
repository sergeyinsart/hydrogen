import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AssetClass, DashboardService} from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  assetSize: any;
  assetClasses: AssetClass[];
  private pieChartData: any;
  private pieChartLabels: any;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) {
    this.assetSize = route.snapshot.data.assetSize.value;
    this.assetClasses = route.snapshot.data.holdings.map((a: AssetClass) => {
      a.balance = this.dashboardService.calculateBalance(a, this.assetSize);
      return a;
    });

    this.pieChartData = this.assetClasses.map(a => a.weight);
    this.pieChartLabels = this.assetClasses.map(a => a.name);
  }

  ngOnInit() {
  }

}
