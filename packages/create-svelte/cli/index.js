import fs from 'fs';
import path from 'path';
import { bold, cyan, green, red } from 'kleur/colors';
import parser from 'gitignore-parser';
import { mkdirp } from '@sveltejs/app-utils';
import gitignore_contents from '../template/.gitignore';
import prompts from 'prompts/lib/index';
import glob from 'tiny-glob/sync';

const disclaimer = `
█████████  ███████████    ███████    ███████████  ███
███░░░░░███░█░░░███░░░█  ███░░░░░███ ░░███░░░░░███░███
░███    ░░░ ░   ░███  ░  ███     ░░███ ░███    ░███░███
░░█████████     ░███    ░███      ░███ ░██████████ ░███
░░░░░░░░███    ░███    ░███      ░███ ░███░░░░░░  ░███
███    ░███    ░███    ░░███     ███  ░███        ░░░ 
░░█████████     █████    ░░░███████░   █████        ███
░░░░░░░░░     ░░░░░       ░░░░░░░    ░░░░░        ░░░ 
                                                      
Pump the brakes! A little disclaimer...

svelte@next is not ready for use yet. It definitely can't
run your apps, and it might not run at all.

We haven't yet started accepting community contributions,
and we don't need people to start raising issues yet.

Given these warnings, please feel free to experiment, but
you're on your own for now. We'll have something to show
soon.
`

async function main() {
  console.log(red(disclaimer));

	const target = process.argv[2] || '.';

	if (fs.existsSync(target)) {
		if (fs.readdirSync(target).length > 0) {
			const response = await prompts({
				type: 'confirm',
				name: 'value',
				message: 'Directory not empty. Continue?',
				initial: false
			});

			if (!response.value) {
				process.exit(1);
			}
		}
	} else {
		mkdirp(target);
	}

	const cwd = path.join(__dirname, 'template');
	const gitignore = parser.compile(gitignore_contents);

	const files = glob('**/*', { cwd }).filter(gitignore.accepts);

	files.forEach(file => {
		const src = path.join(cwd, file);
		const dest = path.join(target, file);

		if (fs.statSync(src).isDirectory()) {
			mkdirp(dest);
		} else {
			fs.copyFileSync(src, dest);
		}
	});

	fs.writeFileSync(path.join(target, '.gitignore'), gitignore_contents);

	const pkg_file = path.join(target, 'package.json');
	const pkg_json = fs.readFileSync(pkg_file, 'utf-8');
	const name = path.basename(path.resolve(target));

	fs.writeFileSync(pkg_file, pkg_json.replace(/workspace:/g, '').replace('~TODO~', name));

	console.log(bold(green(`✔ Copied project files`)));
	console.log(`\nNext steps:`);
	let i = 1;

	const relative = path.relative(process.cwd(), target);
	if (relative !== '') {
		console.log(`  ${i++}: ${bold(cyan(`cd ${relative}`))}`);
	}

	console.log(`  ${i++}: ${bold(cyan('npm install'))} (or pnpm install, or yarn)`);
	console.log(`  ${i++}: ${bold(cyan('npm run dev -- --open'))}`);

	console.log(`\nTo close the dev server, hit ${bold(cyan('Ctrl-C'))}`);
	console.log('\nStuck? Visit us at https://svelte.dev/chat\n');
}

main();