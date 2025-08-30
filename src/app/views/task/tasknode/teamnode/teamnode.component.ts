import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-teamnode',
  templateUrl: './teamnode.component.html',
  imports: [NgChartsModule],
  styleUrls: ['./teamnode.component.scss'],
})
export class TeamnodeComponent  implements OnInit {
  
  ngOnInit(): void {

  }

  @Input() node: any;
  expanded = true;

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  get chartData() {
    return {
      labels: ['Deadline', 'Active'],
      datasets: [
        {
          data: [this.node.DEADLINE, this.node.ACTIVE],
          backgroundColor: ['#EF4444', '#10B981'],
          borderWidth: 1
        }
      ]
    };
  }

  get chartOptions() {
    const total = this.node.DEADLINE + this.node.ACTIVE;
    const percent = total > 0 ? Math.round(this.node.ACTIVE) : 0;

    return {
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        // Custom plugin to draw text
        beforeDraw: (chart: any) => {
          const { ctx, width } = chart;
          ctx.save();
          ctx.font = 'bold 14px Nunito';
          ctx.fillStyle = '#111';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${percent}%`, width / 2, chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2);
        }
      }
    };
  }

}
