const os = require("os");

const hostName = os.hostname();
console.log("내 PC의 호스트이름은: ", hostName);

const tmpDir = os.tmpdir();
console.log("내 PC의 OS에서 사용하는 임시 디렉토리는: ", tmpDir);

const cpus = os.cpus();
console.log("내 PC의 CPU들의 코어 갯수는: ", cpus);
console.log("내 PC의 CPU들의 첫번째 코어는: ", cpus[0]);

const platform = os.platform();
const version = os.version();
const release = os.release();
console.log(`내 PC의 운영 체제는 ${platform} , 버전은 ${version}, 릴리즈는  ${release}`);