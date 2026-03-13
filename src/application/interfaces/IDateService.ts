export interface IDateService {
  adicionarDias(data: Date, dias: number): Date;
  ehFimDeSemana(data: Date): boolean;
  moverParaProximoDiaUtil(data: Date): Date;
  obterDiaDoMes(data: Date): number;
  obterMes(data: Date): number;
  obterAno(data: Date): number;
  criarData(ano: number, mes: number, dia: number): Date;
  obterDiasNoMes(ano: number, mes: number): number;
}