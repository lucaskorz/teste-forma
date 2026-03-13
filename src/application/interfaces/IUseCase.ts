export interface IUseCase<TArgs = unknown, TResult = unknown> {
  execute(args: TArgs): Promise<TResult>;
}
