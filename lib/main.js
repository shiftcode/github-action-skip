"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const git = __importStar(require("@actions/github"));
const INPUT = 'skipOnCommitMsg';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.debug('start working');
            const skipOnCommitMsg = core.getInput(INPUT);
            console.log(`skip CI on commit message ${skipOnCommitMsg}`);
            // console.log(JSON.stringify(git.context))
            switch (git.context.eventName) {
                case 'pull_request':
                    console.log('just proceed for pull request');
                    break;
                case 'push':
                    const commitMessage = git.context.payload.head_commit.message;
                    if (commitMessage.includes(skipOnCommitMsg)) {
                        core.setFailed(`stopping here, because the commit message contains the provided input <${skipOnCommitMsg}>`);
                    }
                    else {
                        console.log('no need to skip the build');
                    }
                    break;
                default:
                    console.log(`no implementation for event type ${git.context.eventName}`);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
