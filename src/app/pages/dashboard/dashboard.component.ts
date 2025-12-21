import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { DashboardFacade } from '../../core/facades/dashboard.facade';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { NgApexchartsModule } from 'ng-apexcharts';

// Tipo simples para os gráficos
type ChartOptions = any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, KpiCardComponent, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Dados dos KPIs (valores simples)
  precoMedioGasolina$: Observable<number>;
  totalLitros$: Observable<number>;
  totalPostos$: Observable<number>;
  precoMedioDiesel$!: Observable<number>;


  // Opções dos gráficos
  lineChartOptions$: Observable<ChartOptions>;
  barChartOptions$: Observable<ChartOptions>;

  // Cores dos gráficos (DSGOV)
  private coresGraficos = ['#1351B4', '#168821', '#FFCD07'];

  constructor(private dashboardFacade: DashboardFacade) {
    // Busca os dados do facade
    this.precoMedioGasolina$ = this.dashboardFacade.precoMedioGasolina$;
    this.totalLitros$ = this.dashboardFacade.totalLitros$;
    this.totalPostos$ = this.dashboardFacade.totalPostos$;
    this.precoMedioDiesel$ = this.dashboardFacade.precoMedioDiesel$;

    // Cria os gráficos a partir dos dados
    this.lineChartOptions$ = this.dashboardFacade.evolucaoPrecos$.pipe(
      map(dados => this.criarGraficoLinha(dados))
    );

    this.barChartOptions$ = this.dashboardFacade.consumoPorEstado$.pipe(
      map(dados => this.criarGraficoBarras(dados))
    );
  }

  // Cria o gráfico de linha (evolução de preços)
  private criarGraficoLinha(dados: any[]): ChartOptions {
    if (!dados || dados.length === 0) {
      return { series: [], chart: { type: 'line', height: 350 } };
    }

    // Pega todos os meses únicos de todas as séries
    const todosMeses = new Set<string>();
    dados.forEach(item => {
      item.series.forEach((p: any) => todosMeses.add(p.name));
    });
    
    // Ordena os meses na ordem correta
    const ordemMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const meses = Array.from(todosMeses).sort((a, b) => 
      ordemMeses.indexOf(a) - ordemMeses.indexOf(b)
    );

    // Transforma os dados para o formato do gráfico
    const series = dados.map(item => {
      // Cria um mapa para encontrar valores por mês
      const mapaValores = new Map();
      item.series.forEach((p: any) => mapaValores.set(p.name, p.value));
      
      return {
        name: item.name,
        data: meses.map(mes => mapaValores.get(mes) || null)
      };
    });

    return {
      series: series,
      chart: { type: 'line', height: 350, toolbar: { show: false } },
      colors: this.coresGraficos,
      stroke: {
        curve: 'smooth',
        width: 3
      },
      markers: {
        size: 5,
        hover: { size: 7 }
      },
      xaxis: { categories: meses },
      yaxis: { 
        title: { text: 'Preço (R$)' },
        labels: { formatter: (val: number) => `R$ ${val.toFixed(2)}` }
      },
      legend: { position: 'top' },
      // Tooltip que mostra todos os valores quando passar o mouse
      tooltip: {
        shared: true, 
        intersect: false,
        y: { 
          formatter: (val: number) => {
            if (val === null || val === undefined) return 'N/A';
            return `R$ ${val.toFixed(2)}`;
          }
        }
      },
      states: {
        hover: {
          filter: { type: 'none' }
        }
      }
    };
  }

  // Cria o gráfico de barras (consumo por estado)
  private criarGraficoBarras(dados: { name: string; value: number }[]): ChartOptions {
    return {
      series: [{ 
        name: 'Litros', 
        data: dados.map(item => item.value) 
      }],
      chart: { type: 'bar', height: 350 },
      colors: [this.coresGraficos[0]],
      xaxis: {
        categories: dados.map(item => item.name), // Nomes dos estados
        title: { text: 'Estado (UF)' }
      },
      yaxis: {
        title: { text: 'Litros' }
      },
      tooltip: {
        y: { formatter: (val: number) => `${val.toFixed(0)} L` }
      }
    };
  }
}