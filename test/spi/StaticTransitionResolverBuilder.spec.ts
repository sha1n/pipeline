import { createTransitionResolverBuilder } from '../../lib/spi/StaticTransitionResolverBuilder';
import { Terminal } from '../../lib/spi/types';
import { MyEntity, MyState } from '../examples';
import { aMockHandler } from '../mocks';
import type { TransitionRecord } from '../../lib/spi/types';
import type { HandlerContext } from '../../lib/types';

type MyTransitionRecord = TransitionRecord<MyEntity, MyState, HandlerContext>;

describe('StaticTransitionResolverBuilder', () => {
  test('should build a full StaticTransitionResolver', () => {
    const resolver = createTransitionResolverBuilder()
      .withTransition(MyState.A, MyState.B, aMockHandler())
      .withTerminalStates(MyState.Failed, MyState.Completed)
      .build();

    const aTransition = resolver.resolveTransitionFrom(new MyEntity(MyState.A)) as MyTransitionRecord;
    expect(aTransition.targetState).toEqual(MyState.B);

    expect(resolver.resolveTransitionFrom(new MyEntity(MyState.Failed))).toEqual(Terminal);
    expect(resolver.resolveTransitionFrom(new MyEntity(MyState.Completed))).toEqual(Terminal);
  });

  test('should create proper passthrough records', async () => {
    const resolver = createTransitionResolverBuilder<MyEntity, MyState, HandlerContext>()
      .withPassthrough(MyState.A, MyState.C)
      .build();
    const entity = new MyEntity(MyState.A);

    const { handler, targetState } = resolver.resolveTransitionFrom(entity) as MyTransitionRecord;

    expect(targetState).toEqual(MyState.C);
    await expect(handler.handle(entity, {})).resolves.toEqual(entity);
  });
});
