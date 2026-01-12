import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { ConsultaFacade } from '@facades/consulta.facade';
import { Abastecimento } from '../../../core/models/abastecimento.model';
import { CpfMaskPipe } from '../../../shared/pipes/cpf-mask.pipe';

@Component({
  selector: 'app-consulta-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule, CpfMaskPipe],
  templateUrl: './consulta-detalhe.component.html',
  styleUrl: './consulta-detalhe.component.scss',
})
export class ConsultaDetalheComponent implements OnInit {
  abastecimento$!: Observable<Abastecimento | undefined>;

  constructor(
    private route: ActivatedRoute,
    private consultaFacade: ConsultaFacade,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Abordagem reativa para buscar o abastecimento.
    // Isso garante que os dados sejam atualizados se o ID na URL mudar
    // sem que o usuário saia da página (ex: navegação interna).
    this.abastecimento$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id =>
        this.consultaFacade.abastecimentosFiltrados$.pipe(
          map(lista => lista.find(item => item.id === id)
        ))
      )
    );
  }

  voltar(): void {
    this.location.back();
  }

  reportarErro(): void {
    // Em uma aplicação real, isso chamaria um serviço para registrar o erro
    // e exibiria uma notificação não bloqueante (ex: toast/snackbar).
    console.log('Solicitação de correção enviada para análise.');
    alert('Obrigado! Sua solicitação de correção foi enviada para análise.');
  }
}
