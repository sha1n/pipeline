import { NoopTransitionHandler } from '../lib/NoopTransitionHandler';
import { createStaticHandlerResolver } from '../lib/StaticHandlerResolverBuilder';
import { MyState } from './examples';
import { aMockHandler } from './mocks';
import type { DefaultTransitionHandler } from '../lib/DefaultTransitionHandler';
import type { HandlerContext } from '../lib/types';
import type { MyEntity } from './examples';
import { NonRecoverablePipelineError } from '../lib/errors';

describe('StaticHandlerResolverBuilder', () => {
  test('should build a strict resolver by default', () => {
    const resolver = createStaticHandlerResolver()
      .withTransition(MyState.A, MyState.Completed, aMockHandler())
      .withDeadStates(MyState.Failed, MyState.Completed)
      .build();

    const handler = resolver.resolveHandlerFor(
      MyState.A
    ) as DefaultTransitionHandler<MyEntity, MyState, HandlerContext>;
    expect(handler.targetState).toEqual(MyState.Completed);
    expect(resolver.resolveHandlerFor(MyState.Failed)).toEqual(
      NoopTransitionHandler
    );
    expect(resolver.resolveHandlerFor(MyState.Completed)).toEqual(
      NoopTransitionHandler
    );
    expect(() => resolver.resolveHandlerFor(MyState.B)).toThrow(
      NonRecoverablePipelineError
    );
  });

  test('should build a non-strict resolver', () => {
    const resolver = createStaticHandlerResolver(false)
      .withTransition(MyState.A, MyState.Completed, aMockHandler())
      .withDeadStates(MyState.Failed, MyState.Completed)
      .build();

    expect(resolver.resolveHandlerFor(MyState.B)).toEqual(
      NoopTransitionHandler
    );
  });
});
