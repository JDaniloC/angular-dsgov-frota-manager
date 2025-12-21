import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs';
import { FuelService } from '../services/fuel.service';
import { Abastecimento } from '../models/abastecimento.model';

// Define a lista fixa de UFs qpara monitoramento
const LISTA_UFS = ['SP', 'RJ', 'MG', 'PR', 'RS', 'BA', 'SC', 'GO', 'PE', 'CE'];

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  // Cria um fluxo que busca os dados e os mantém "vivos" para vários componentes
  private abastecimentos$: Observable<Abastecimento[]>;

  // KPIs
  public precoMedioGasolina$: Observable<number>;
  public precoMedioDiesel$: Observable<number>;
  public totalLitros$: Observable<number>;
  public totalPostos$: Observable<number>;
  public consumoPorEstado$: Observable<{ name: string; value: number }[]>;
  public evolucaoPrecos$: Observable<{ name: string; series: { name: string; value: number }[] }[]>;

  constructor(private fuelService: FuelService) {
    this.abastecimentos$ = this.fuelService.getAbastecimentos().pipe(
      map((response: any) => (response && response.abastecimentos) || response || []),
      shareReplay(1) // evita múltiplas chamadas HTTP
    );

    // KPI: Preço Médio Gasolina
    this.precoMedioGasolina$ = this.abastecimentos$.pipe(
      map(lista => {
        const gasolinaLista = lista.filter(item => item.tipoCombustivel === 'Gasolina');
        if (gasolinaLista.length === 0) return 0;
        const soma = gasolinaLista.reduce((acc, curr) => acc + curr.valorLitro, 0);
        return soma / gasolinaLista.length;
      })
    );

    // KPI: Preço Médio Diesel
    this.precoMedioDiesel$ = this.abastecimentos$.pipe(
      map(lista => {
        const dieselLista = lista.filter(item => item.tipoCombustivel === 'Diesel');
        if (dieselLista.length === 0) return 0;
        const soma = dieselLista.reduce((acc, curr) => acc + curr.valorLitro, 0);
        return soma / dieselLista.length;
      })
    );

    // KPI: Total de Litros Consumidos
    this.totalLitros$ = this.abastecimentos$.pipe(
      map(lista => lista.reduce((acc, curr) => acc + curr.quantidadeLitros, 0))
    );

    // KPI: Quantidade de Postos Monitorados
    this.totalPostos$ = this.abastecimentos$.pipe(
      map(lista => new Set(lista.map(item => item.posto)).size)
    );

    // Gráfico: Consumo por Estado (Top 10)
    this.consumoPorEstado$ = this.abastecimentos$.pipe(
      map(lista => {
        // Cria um mapa inicial
        const dadosIniciais = LISTA_UFS.reduce((acc, uf) => ({ ...acc, [uf]: 0 }), {} as { [key: string]: number });

        // Soma os litros de cada abastecimento no seu estado
        const agrupado = lista.reduce((acc: { [key: string]: number }, curr) => {
          if (acc[curr.uf] !== undefined) {
            acc[curr.uf] += curr.quantidadeLitros;
          }
          return acc;
        }, dadosIniciais);

        // Transforma o objeto no formato array [{ name, value }] do ngx-charts
        return Object.keys(agrupado)
          .map(uf => ({
            name: uf,
            value: agrupado[uf]
          }))
          .sort((a, b) => b.value - a.value) // Ordenamos do maior para o menor
          .slice(0, 10); // Garante apenas o Top 10
      })
    );

    // Gráfico: Evolução de Preços por Combustível
    this.evolucaoPrecos$ = this.abastecimentos$.pipe(
      map(lista => {
        const tipos = ['Gasolina', 'Diesel', 'Etanol'];
        
        // Cria a série para cada tipo de combustível
        return tipos.map(tipo => ({
          name: tipo,
          series: this.getMediaMensal(lista, tipo)
        }));
      })
    );
  }

  private getMediaMensal(lista: Abastecimento[], tipo: string): { name: string; value: number }[] {
    const mesesAbreviados = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dadosMensais: { [key: number]: { soma: number; count: number } } = {};

    lista
      .filter(item => item.tipoCombustivel === tipo)
      .forEach(item => {
        const mes = new Date(item.data).getMonth(); // 0 = Janeiro, 11 = Dezembro
        if (!dadosMensais[mes]) {
          dadosMensais[mes] = { soma: 0, count: 0 };
        }
        dadosMensais[mes].soma += item.valorLitro;
        dadosMensais[mes].count++;
      });

    return Object.keys(dadosMensais)
      .map(mesStr => {
        const mesIndex = parseInt(mesStr, 10);
        const media = dadosMensais[mesIndex].soma / dadosMensais[mesIndex].count;
        return { name: mesesAbreviados[mesIndex], value: media };
      })
      .sort((a, b) => mesesAbreviados.indexOf(a.name) - mesesAbreviados.indexOf(b.name)); // Ordena por mês
  }
}
