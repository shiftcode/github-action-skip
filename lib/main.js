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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const https_1 = __importDefault(require("https"));
var INPUT_PARAMS;
(function (INPUT_PARAMS) {
    INPUT_PARAMS["SKIP_ON_COMMIT_MSG"] = "skipOnCommitMsg";
    INPUT_PARAMS["GH_TOKEN"] = "githubToken";
})(INPUT_PARAMS || (INPUT_PARAMS = {}));
var OUTPUT_PARAMS;
(function (OUTPUT_PARAMS) {
    OUTPUT_PARAMS["SHOULD_EXECUTE"] = "shouldExecute";
})(OUTPUT_PARAMS || (OUTPUT_PARAMS = {}));
async function run() {
    try {
        const skipOnCommitMsg = core.getInput(INPUT_PARAMS.SKIP_ON_COMMIT_MSG);
        const ghToken = core.getInput(INPUT_PARAMS.GH_TOKEN);
        core.info(`reading git commit message to resolve the output variable, output variable will be true if commit message contains message "${skipOnCommitMsg}"`);
        const { eventName } = github.context;
        core.info(`event name: ${eventName}`);
        let sha = '';
        switch (eventName) {
            case 'pull_request':
                core.info(JSON.stringify(github.context.payload.pull_request));
                sha = github.context.payload.pull_request?.head.sha ?? `unknown`;
                break;
            case 'push':
                sha = github.context.sha;
                break;
            default:
                core.setFailed(`no implementation for event name ${eventName}`);
                return;
        }
        if (sha) {
            const url = `https://api.github.com/repos/${github.context.payload.repository?.full_name}/git/commits/${sha}`;
            core.info(`fetch commit with url: ${url}`);
            const commit = (await fetch(url, ghToken)); /* and others */
            const commitMessage = commit.message;
            core.info(`commit message to check against "${commitMessage}"`);
            if (commitMessage.includes(skipOnCommitMsg)) {
                core.info(`commit message includes skip message (${skipOnCommitMsg}) -> set output ${OUTPUT_PARAMS.SHOULD_EXECUTE} = false`);
                core.setOutput(OUTPUT_PARAMS.SHOULD_EXECUTE, false);
                return;
            }
        }
        core.info(`commit message does not include skip message (${skipOnCommitMsg}) -> set output ${OUTPUT_PARAMS.SHOULD_EXECUTE} = true`);
        core.setOutput(OUTPUT_PARAMS.SHOULD_EXECUTE, true);
    }
    catch (error) {
        core.error('there was an error');
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        try {
            core.setFailed(JSON.stringify(error));
        }
        catch (err) {
            core.setFailed(`there was an error, can't print JSON.stringify failed`);
        }
    }
}
async function fetch(url, token) {
    return new Promise((resolve) => {
        https_1.default.get(url, {
            headers: {
                Authorization: `token ${token}`,
                'User-Agent': 'Github Skip Action',
            },
        }, res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
    });
}
run();
