export interface Abastecimento {
  id: number;
  data: string;
  posto: string;
  uf: string;
  tipoCombustivel: string;
  valorLitro: number;
  quantidadeLitros: number;
  valorTotalPago: number;
}