﻿import * as _ from "lodash";
import * as common from "../Common/_all";
import * as proxy from "../Proxy/_all";

export class Times {

    private static NO_MATCHING_CALLS_EXACTLY_N_TIMES = "expected invocation of <%= i %> <%= n %> times, invoked <%= m %> times";
    private static NO_MATCHING_CALLS_AT_LEAST_ONCE = "expected invocation of <%= i %> at least once, invoked <%= m %> times";
    private static NO_MATCHING_CALLS_AT_MOST_ONCE = "expected invocation of <%= i %> at most once, invoked <%= m %> times";

    private _lastCallCount: number;
    private _failMessage: (...data: any[]) => string;

    private constructor(
        private _condition: common.IFunc2<number, boolean>,
        public readonly min: number,
        public readonly max: number,
        failMessage: string) {
        this._failMessage = _.template(failMessage);
    }

    failMessage(call: proxy.ICallContext) { 
        return this._failMessage({ i: call, n: this.min, m: this._lastCallCount }); 
    }

    verify(callCount: number): boolean {
        this._lastCallCount = callCount;
        return this._condition(callCount);
    }

    static exactly(n: number): Times {
        return new Times(c => c === n, n, n, Times.NO_MATCHING_CALLS_EXACTLY_N_TIMES);
    }

    static never(): Times {
        return Times.exactly(0);
    }

    static once(): Times {
        return Times.exactly(1);
    }

    static atLeastOnce(): Times {
        return new Times(c => c >= 1, 1, 255, Times.NO_MATCHING_CALLS_AT_LEAST_ONCE);
    }

    static atMostOnce(): Times {
        return new Times(c => c >= 0 && c <= 1, 0, 1, Times.NO_MATCHING_CALLS_AT_MOST_ONCE);
    }
}