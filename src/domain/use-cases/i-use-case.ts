import type Result from '../value-types/transients/result';

export default interface IUseCase<
  IRequest,
  IResponse extends Result<unknown>,
  IAuth = undefined,
  IApi = undefined
> {
  execute: (props: {
    req: IRequest;
    auth: IAuth;
    api: IApi;
  }) => Promise<IResponse> | IResponse;
}
