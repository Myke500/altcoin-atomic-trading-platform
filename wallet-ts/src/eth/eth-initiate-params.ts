import {InitiateParams} from "../common/initiate-params";

export class EthInitiateParams extends InitiateParams {
  constructor(public refundTime, public secret, public address, public amount, public extendedParams) {
    super();
  }
}