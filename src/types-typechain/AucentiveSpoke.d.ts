/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface AucentiveSpokeInterface extends ethers.utils.Interface {
  functions: {
    "USDC()": FunctionFragment;
    "gasService()": FunctionFragment;
    "gateway()": FunctionFragment;
    "owner()": FunctionFragment;
    "sendServicePayment(string,string,bytes32,uint256)": FunctionFragment;
    "sendToMany(string,string,address[],string,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "withdrawBalanceViaAdmin(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "USDC", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "gasService",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "gateway", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "sendServicePayment",
    values: [string, string, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "sendToMany",
    values: [string, string, string[], string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawBalanceViaAdmin",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "USDC", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "gasService", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "gateway", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "sendServicePayment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sendToMany", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawBalanceViaAdmin",
    data: BytesLike
  ): Result;

  events: {
    "ServicePaymentConfirmed(bytes32)": EventFragment;
    "ServicePaymentRefunded(bytes32,uint256)": EventFragment;
    "ServicePaymentSent(bytes32,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ServicePaymentConfirmed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ServicePaymentRefunded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ServicePaymentSent"): EventFragment;
}

export type ServicePaymentConfirmedEvent = TypedEvent<
  [string] & { serviceId: string }
>;

export type ServicePaymentRefundedEvent = TypedEvent<
  [string, BigNumber] & { serviceId: string; refundAmount: BigNumber }
>;

export type ServicePaymentSentEvent = TypedEvent<
  [string, BigNumber] & { serviceId: string; payAmount: BigNumber }
>;

export class AucentiveSpoke extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: AucentiveSpokeInterface;

  functions: {
    USDC(overrides?: CallOverrides): Promise<[string]>;

    gasService(overrides?: CallOverrides): Promise<[string]>;

    gateway(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    sendServicePayment(
      destinationChain: string,
      destinationAddress: string,
      serviceId: BytesLike,
      payAmount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sendToMany(
      destinationChain: string,
      destinationAddress: string,
      destinationAddresses: string[],
      symbol: string,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdrawBalanceViaAdmin(
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  USDC(overrides?: CallOverrides): Promise<string>;

  gasService(overrides?: CallOverrides): Promise<string>;

  gateway(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  sendServicePayment(
    destinationChain: string,
    destinationAddress: string,
    serviceId: BytesLike,
    payAmount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sendToMany(
    destinationChain: string,
    destinationAddress: string,
    destinationAddresses: string[],
    symbol: string,
    amount: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdrawBalanceViaAdmin(
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    USDC(overrides?: CallOverrides): Promise<string>;

    gasService(overrides?: CallOverrides): Promise<string>;

    gateway(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    sendServicePayment(
      destinationChain: string,
      destinationAddress: string,
      serviceId: BytesLike,
      payAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    sendToMany(
      destinationChain: string,
      destinationAddress: string,
      destinationAddresses: string[],
      symbol: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawBalanceViaAdmin(
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ServicePaymentConfirmed(bytes32)"(
      serviceId?: null
    ): TypedEventFilter<[string], { serviceId: string }>;

    ServicePaymentConfirmed(
      serviceId?: null
    ): TypedEventFilter<[string], { serviceId: string }>;

    "ServicePaymentRefunded(bytes32,uint256)"(
      serviceId?: null,
      refundAmount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { serviceId: string; refundAmount: BigNumber }
    >;

    ServicePaymentRefunded(
      serviceId?: null,
      refundAmount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { serviceId: string; refundAmount: BigNumber }
    >;

    "ServicePaymentSent(bytes32,uint256)"(
      serviceId?: null,
      payAmount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { serviceId: string; payAmount: BigNumber }
    >;

    ServicePaymentSent(
      serviceId?: null,
      payAmount?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { serviceId: string; payAmount: BigNumber }
    >;
  };

  estimateGas: {
    USDC(overrides?: CallOverrides): Promise<BigNumber>;

    gasService(overrides?: CallOverrides): Promise<BigNumber>;

    gateway(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    sendServicePayment(
      destinationChain: string,
      destinationAddress: string,
      serviceId: BytesLike,
      payAmount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sendToMany(
      destinationChain: string,
      destinationAddress: string,
      destinationAddresses: string[],
      symbol: string,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdrawBalanceViaAdmin(
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    USDC(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    gasService(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    gateway(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    sendServicePayment(
      destinationChain: string,
      destinationAddress: string,
      serviceId: BytesLike,
      payAmount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sendToMany(
      destinationChain: string,
      destinationAddress: string,
      destinationAddresses: string[],
      symbol: string,
      amount: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdrawBalanceViaAdmin(
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
