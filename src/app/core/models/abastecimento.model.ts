export interface Abastecimento {
  id: string;
  data: string;
  posto: string;
  uf: string;
  tipoCombustivel: string;
  valorLitro: number;
  motorista: {
    nome: string;
    cpf: string;
  };
  veiculo: {
    placa: string;
    modelo: string;
  };
  quantidadeLitros: number;
  valorTotalPago: number;
}
