
type OperatingSystem = "darwin" | "linux" | "windows";

interface Clipboard {
	readonly os: OperatingSystem;

    readText(): Promise<string>;
    writeText(text: string): Promise<void>;
}

const darwin: Clipboard = {
    os: "darwin",
    async readText() {
		const command = Deno.run({
cmd: ["pbpaste"],
stdout: "piped",
});
		const output = await command.output();
		command.close();
		return new TextDecoder().decode(output);
    },
	async writeText(text: string) {
		const command = Deno.run({
cmd: ["pbcopy"],
stdin: "piped",
});
		await command.stdin?.write(new TextEncoder().encode(text));
		command.stdin?.close();
		command.status();
	}
};

const linux: Clipboard = {
    os: "linux",
    async readText() {
		const command = Deno.run({
cmd: ["xclip","-selection","clipboard","-o"],
stdout: "piped",
});
		const output = await command.output();
		command.close();
		return new TextDecoder().decode(output);
    },
    async writeText(text: string) {
		const command = Deno.run({
cmd: ["xclip","-selection","clipboard","-i"],
stdin: "piped",
});
		await command.stdin?.write(new TextEncoder().encode(text));
		command.stdin?.close();
	    command.status();
	}
};

const windows: Clipboard = {
    os: "windows",
    async readText() {
		const command = Deno.run({
cmd: ["powershell","-Command","Get-Clipboard"],
stdout: "piped",
});
		const output = await command.output();
		command.close();
		return new TextDecoder().decode(output);
    },
    async writeText(text: string) {
		const command = Deno.run({
cmd: ["powershell","-Command","Set-Clipboard"],
stdin: "piped",
});
		await command.stdin?.write(new TextEncoder().encode(text));
		command.stdin?.close();
	    command.status();
	}
};

const clipboard: Clipboard = Deno.build.os === "darwin" ? darwin :
  Deno.build.os === "linux" ? linux : windows;

export default clipboard;