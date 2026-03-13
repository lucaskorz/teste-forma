import { IUseCase } from "../../interfaces/IUseCase.js";
import { IDateService } from "../../interfaces/IDateService.js";
import { Parcela } from "../../../domain/types/Parcela.js";

export interface CalcularParcelasEntrada {
  dataCompra: Date;
  dataEntrega: Date;
  clienteInadimplente: boolean;
}

export class CalcularParcelasUseCase implements IUseCase<CalcularParcelasEntrada, Parcela[]> {
  constructor(private readonly servicoData: IDateService) { }

  async execute(entrada: CalcularParcelasEntrada): Promise<Parcela[]> {
    const { dataCompra, dataEntrega, clienteInadimplente } = entrada;

    const parcelas: Parcela[] = [];

    let dataPrimeiraParcela = this.servicoData.adicionarDias(dataCompra, 2);

    dataPrimeiraParcela =
      this.servicoData.moverParaProximoDiaUtil(dataPrimeiraParcela);

    if (
      clienteInadimplente &&
      this.dataEhPosterior(dataPrimeiraParcela, dataCompra)
    ) {
      return [];
    }

    parcelas.push({
      numeroParcela: 1,
      dataVencimento: dataPrimeiraParcela,
    });

    const diaVencimento = this.obterDiaVencimento(dataCompra);

    const anoPrimeira = this.servicoData.obterAno(dataPrimeiraParcela);
    const mesPrimeira = this.servicoData.obterMes(dataPrimeiraParcela);
    const diaPrimeira = this.servicoData.obterDiaDoMes(dataPrimeiraParcela);

    const { ano: anoSegunda, mes: mesSegunda } = this.calcularMesAnoSegundaParcela(
      anoPrimeira,
      mesPrimeira,
      diaPrimeira
    );

    const dataPosterior = this.dataEhPosterior(
      dataPrimeiraParcela,
      dataEntrega
    )

    let parcelasDepoisDaEntrega = dataPosterior ? 1 : 0;

    let numeroParcela = 2;
    const anoBase = anoSegunda;
    const mesBase = mesSegunda;

    while (parcelasDepoisDaEntrega < 3) {
      const { ano, mes } = this.adicionarMeses(
        anoBase,
        mesBase,
        numeroParcela - 2
      );

      let dataVencimento = this.servicoData.criarData(
        ano,
        mes,
        diaVencimento
      );

      dataVencimento = this.servicoData.moverParaProximoDiaUtil(dataVencimento);

      if (
        clienteInadimplente &&
        this.dataEhPosterior(dataVencimento, dataCompra)
      ) {
        break;
      }

      parcelas.push({
        numeroParcela,
        dataVencimento,
      });

      if (this.dataEhPosterior(dataVencimento, dataEntrega)) {
        parcelasDepoisDaEntrega++;
      }

      numeroParcela++;
    }

    return parcelas;
  }

  private obterDiaVencimento(data: Date): number {
    const diaCompra = this.servicoData.obterDiaDoMes(data);

    if (
      (diaCompra >= 1 && diaCompra <= 5) ||
      (diaCompra >= 21 && diaCompra <= 31)
    ) {
      return 5;
    }

    if (diaCompra >= 6 && diaCompra <= 10) {
      return 10;
    }

    if (diaCompra >= 11 && diaCompra <= 20) {
      return 20;
    }

    return 5;
  }

  private calcularMesAnoSegundaParcela(
    anoPrimeira: number,
    mesPrimeira: number,
    diaPrimeira: number
  ): { ano: number; mes: number } {

    const diasNoMes = this.servicoData.obterDiasNoMes(
      anoPrimeira,
      mesPrimeira
    );

    const estaNosUltimos10Dias = diaPrimeira > diasNoMes - 10;
    const mesesIncrementar = estaNosUltimos10Dias ? 2 : 1;

    return this.adicionarMeses(
      anoPrimeira,
      mesPrimeira,
      mesesIncrementar
    );
  }

  private adicionarMeses(
    ano: number,
    mes: number,
    quantidade: number
  ): { ano: number; mes: number } {

    const zeroBased = ano * 12 + (mes - 1) + quantidade;

    const novoAno = Math.floor(zeroBased / 12);
    const novoMes = (zeroBased % 12) + 1;

    return { ano: novoAno, mes: novoMes };
  }

  private dataEhPosterior(a: Date, b: Date): boolean {
    return a.getTime() > b.getTime();
  }
}