import assert from 'assert';
import { Pipeline } from './Pipeline';
import type { TransitionResolver } from './spi/types';
import type {
  OnErrorHandler,
  StatefulPipelineEntity,
  HandlerContext,
  StateRepository,
  OnBeforeHandler,
  OnAfterHandler
} from './types';

class PipelineBuilder<T extends StatefulPipelineEntity<S>, S, C extends HandlerContext> {
  private repository: StateRepository<T, C>;
  private resolver: TransitionResolver<T, S, C>;
  private onErrorHandler: OnErrorHandler<T, C>;
  private onBeforeHandler: OnBeforeHandler<T, C>;
  private onAfterHandler: OnAfterHandler<T, C>;

  withStateRepository(repository: StateRepository<T, C>): PipelineBuilder<T, S, C> {
    this.repository = repository;
    return this;
  }

  withTransitionResolver(resolver: TransitionResolver<T, S, C>): PipelineBuilder<T, S, C> {
    this.resolver = resolver;
    return this;
  }

  withErrorHandler(handler: OnErrorHandler<T, C>): PipelineBuilder<T, S, C> {
    this.onErrorHandler = handler;
    return this;
  }

  withOnBeforeHandler(handler: OnBeforeHandler<T, C>): PipelineBuilder<T, S, C> {
    this.onBeforeHandler = handler;
    return this;
  }

  withOnAfterHandler(handler: OnAfterHandler<T, C>): PipelineBuilder<T, S, C> {
    this.onAfterHandler = handler;
    return this;
  }

  build(): Pipeline<T, S, C> {
    assert(this.resolver, 'A handler resolver must be supplied');
    assert(this.repository, 'A state repository must be supplied');

    return new Pipeline<T, S, C>(
      this.resolver,
      this.repository,
      this.onErrorHandler,
      this.onBeforeHandler,
      this.onAfterHandler
    );
  }
}

function createPipelineBuilder<T extends StatefulPipelineEntity<S>, S, C extends HandlerContext>(): PipelineBuilder<
  T,
  S,
  C
> {
  return new PipelineBuilder<T, S, C>();
}

export { createPipelineBuilder };
