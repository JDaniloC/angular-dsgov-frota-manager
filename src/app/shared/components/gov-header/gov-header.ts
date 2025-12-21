import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { filter } from 'rxjs/operators';

// Define a estrutura de um item do breadcrumb
interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-gov-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gov-header.html',
  styleUrls: ['./gov-header.scss'],
})
export class GovHeaderComponent implements OnInit {
  // Array que guardará os breadcrumbs da rota ativa
  public breadcrumbs: Breadcrumb[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Escuta os eventos de navegação do roteador
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // A cada nova navegação, reconstrói o breadcrumb
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  /**
   * Constrói o array de breadcrumbs percorrendo a árvore de rotas.
   */
  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      // Garante que estamos pegando a rota principal
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      // Pega o label definido no `data` da rota
      const label = child.snapshot.data['breadcrumb'];
      if (!label) {
        // Se não houver label, continua para a próxima rota filha
        return this.createBreadcrumbs(child, url, breadcrumbs);
      }

      // Monta a URL do segmento
      const routeURL: string = child.snapshot.url.map((segment) => segment.path).join('/');
      url += `/${routeURL}`;

      // Adiciona o breadcrumb ao array
      breadcrumbs.push({ label, url });

      // Chama recursivamente para as rotas filhas
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
