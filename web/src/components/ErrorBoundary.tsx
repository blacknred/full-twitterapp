import type { ErrorInfo, PropsWithChildren } from 'react'
import { Component } from 'react'

import { Button } from './Elements'

interface IState {
  error: Error | null
  info: ErrorInfo | null
}

export class ErrorBoundary extends Component<PropsWithChildren, IState> {
  state = {
    error: null,
    info: null,
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ error, info })
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div
        className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
        role="alert"
      >
        <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
        <Button className="mt-4" onClick={() => window.location.assign(window.location.origin)}>
          Refresh
        </Button>
      </div>
    )
  }
}

