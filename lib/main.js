"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
// import * as git from '@actions/github'
const INPUT = 'skipOnCommitMsg';
async function run() {
    try {
        core.debug('start working');
        const skipOnCommitMsg = core.getInput(INPUT);
        console.log(`skip CI on commit message ${skipOnCommitMsg}`);
        core.setOutput('shouldExecute', false);
        // `<!--stopping here, because the commit message contains the provided input <${skipOnCommitMsg}>-->`)
        // const ghToken = core.getInput()
        //     git.getOctokit()
        //     console.log(git.context.payload)
        //     const commitMessage = git.context.payload.comment
        //     console.log('commit message', commitMessage)
        //     if (commitMessage.includes(skipOnCommitMsg)) {
        //       core.setFailed(`stopping here, because the commit message contains the provided input <${skipOnCommitMsg}>`)
        //     }
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}
run();
