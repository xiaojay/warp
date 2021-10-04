import { InteractionData } from '@smartweave';

export class ContractCallStack {
  readonly interactions: Map<string, InteractionCall> = new Map();

  constructor(public readonly contractTxId: string, public readonly label: string = '') {}

  addInteractionData(interactionData: InteractionData<any>): InteractionCall {
    const { interaction, interactionTx } = interactionData;

    const interactionCall = InteractionCall.create(
      new InteractionInput(
        interactionTx.id,
        interactionTx.block.height,
        interactionTx.block.timestamp,
        interaction.caller,
        interaction.input.function,
        interaction.input,
        new Map()
      )
    );

    this.interactions.set(interactionTx.id, interactionCall);

    return interactionCall;
  }

  getInteraction(txId: string) {
    return this.interactions.get(txId);
  }
}

export class InteractionCall {
  interactionOutput: InteractionOutput;
  private constructor(readonly interactionInput: InteractionInput) {}

  static create(interactionInput: InteractionInput): InteractionCall {
    return new InteractionCall(interactionInput);
  }

  update(interactionOutput: InteractionOutput) {
    this.interactionOutput = interactionOutput;
  }
}

export class InteractionInput {
  constructor(
    public readonly txId: string,
    public readonly blockHeight: number,
    public readonly blockTimestamp: number,
    public readonly caller: string,
    public readonly functionName: string,
    public readonly functionArguments: [],
    public readonly foreignContractCalls: Map<string, ContractCallStack> = new Map()
  ) {}
}

export class InteractionOutput {
  constructor(
    public readonly cacheHit: boolean,
    public readonly intermediaryCacheHit: boolean,
    public readonly outputState: any,
    public readonly executionTime: number,
    public readonly valid: boolean,
    public readonly errorMessage: string = ''
  ) {}
}
