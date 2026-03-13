import { CalcularParcelasUseCase } from "../../../application/useCases/installment/CalculateInstallmentsUseCase.js";
import { NativeDateService } from "../../../infra/date/NativeDateService.js";
import { CalculateInstallmentsController } from "../../controllers/installment/CalculateInstallmentsController.js";

export function makeCalculateInstallmentsController(): CalculateInstallmentsController {
  const dateService = new NativeDateService();
  const useCase = new CalcularParcelasUseCase(dateService);

  return new CalculateInstallmentsController(useCase);
}
