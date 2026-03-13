import { Request, Response } from "express";
import {
  CalcularParcelasEntrada,
} from "../../../application/useCases/installment/CalculateInstallmentsUseCase.js";
import { IUseCase } from "../../../application/interfaces/IUseCase.js";
import { Parcela } from "../../../domain/types/Parcela.js";

export class CalculateInstallmentsController {
  constructor(
    private readonly calculateInstallmentsUseCase: IUseCase<CalcularParcelasEntrada, Parcela[]>,
  ) { }

  async handler(req: Request, res: Response): Promise<Response> {
    try {
      const entrada: CalcularParcelasEntrada = {
        dataCompra: new Date(2026, 3, 12),
        dataEntrega: new Date(2026, 8, 15),
        clienteInadimplente: false,
      };

      const parcelas = await this.calculateInstallmentsUseCase.execute(entrada);

      return res.json({
        parcelas: parcelas.map((parcela) => ({
          numeroParcela: parcela.numeroParcela,
          dataVencimento: parcela.dataVencimento.toISOString(),
        })),
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ mensagem: "Erro ao calcular as parcelas." });
    }
  }
}
