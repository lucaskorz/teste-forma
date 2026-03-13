import { IDateService } from "../../application/interfaces/IDateService.js";

export class NativeDateService implements IDateService {

  adicionarDias(data: Date, dias: number): Date {
    const resultado = new Date(data.getTime());
    resultado.setDate(resultado.getDate() + dias);
    return resultado;
  }

  ehFimDeSemana(data: Date): boolean {
    const diaSemana = data.getDay();
    return diaSemana === 0 || diaSemana === 6;
  }

  moverParaProximoDiaUtil(data: Date): Date {
    let atual = new Date(data.getTime());

    while (this.ehFimDeSemana(atual)) {
      atual = this.adicionarDias(atual, 1);
    }

    return atual;
  }

  obterDiaDoMes(data: Date): number {
    return data.getDate();
  }

  obterMes(data: Date): number {
    return data.getMonth() + 1;
  }

  obterAno(data: Date): number {
    return data.getFullYear();
  }

  criarData(ano: number, mes: number, dia: number): Date {
    return new Date(ano, mes - 1, dia);
  }

  obterDiasNoMes(ano: number, mes: number): number {
    return new Date(ano, mes, 0).getDate();
  }
}