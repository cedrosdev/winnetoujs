import{Command as Z}from"commander";import*as g from"path";import*as A from"fs";import*as N from"esbuild";import Y from"node-watch";import K from"recursive-readdir";import*as x from"fs";import*as h from"path";import{parse as Q}from"node-html-parser";import X from"escape-string-regexp";import{js as O}from"js-beautify";var v=class{constructor(e){this.constructosSourceFolder=e.constructosSourceFolder,this.verbose=e.verbose||!1,this.promisesConstructos=[],this.idList=[]}async singleParse(e){this.idList=[],await this.transpileConstructo(e)}async parse(){return(await K(this.constructosSourceFolder)).forEach(t=>{(t.endsWith(".wcto.html")||t.endsWith(".wcto.htm"))&&(this.verbose&&console.log("Parsing constructo file:",t),this.promisesConstructos.push(this.transpileConstructo(t)))}),await Promise.all(this.promisesConstructos),this.verbose&&console.log(`\x1B[34mParsed ${this.promisesConstructos.length} constructo files successfully.\x1B[0m`),!0}async transpileConstructo(e){return new Promise((t,r)=>{try{x.readFile(e,"utf8",(o,i)=>{if(o){r(o);return}let p=Q(i.toString()).querySelectorAll("winnetou"),S="";Array.from(p).forEach(a=>{let z=a.getAttribute("description"),$=a.innerHTML,n=`

// ========================================`;n+=`
/**
`,n+=`	* ${z||""}
`;let B=!1,D=!1,P="",l;try{let s=$.match(/\[\[\s?(.*?)\s?\]\]/);if(s)l=s[1];else{console.error(`\x1B[31mError: Constructo ID not found in ${e}. Please ensure it is defined as [[id]].\x1B[0m`);return}}catch{console.error(`Error: Failed to parse ${e}.`);return}let oe=l+"-win-${this.identifier}";this.idList.filter(s=>s.id===l).length>0&&console.error(`Error: Duplicate Constructo ID found in ${e}.`),this.idList.push({file:e,id:l});let k=/\[\[\s*?(.*?)\s*?\]\]/g,I=$.match(k)||[],d="";I.length?(d="ids: {",I.map(m=>m.replace("[[","").replace("]]","")).forEach(m=>{d+=`${m}: \`${m}-win-\${this.identifier}\`,`}),d+="},"):d="";let b=$.replace(/\[\[\s*?(.*?)\s*?\]\]/g,"$1-win-${this.identifier}"),q=new RegExp("{{\\s*?(.*?)\\s*?}}","g"),T=b.match(q),J=[];T&&(D=!0,T.forEach(s=>{let _=s.replace("{{","").replace("}}","").split(":"),W=_[0].split("("),L=_[1]||"",M=_[0].indexOf("?")===-1;M&&(B=!0);let w=W[0].replace("?","").trim();J.push(w);let F=W[1]||"";F=F.replace(")",""),P+=`	* @param {${L||"any"}} ${M?`elements.${w}`:`[elements.${w}]`}  ${F.trim()}
`;let U=X(s);b=b.replace(new RegExp(U,"g"),`\${props?.${w} || ""}`)})),D&&B?n+=`	* @param {object} elements
`:n+=`	* @param {object} [elements]
`,n+=P,n+=`	* @param {object} [options]
`,n+=`	* @param {string} [options.identifier]
`,n+=`	*/
`;let V=`$${l}`,G=this.generateClassString(n,V,l,b,d);S+=G});let te=O(S,{indent_size:1,space_in_empty_paren:!0}),H=O(`
            import {Constructos} from "winnetoujs/core/constructos";
            


            ${S}
          `,{indent_size:1,space_in_empty_paren:!0,preserve_newlines:!1,end_with_newline:!0,max_preserve_newlines:1,wrap_line_length:50,eol:`
`,indent_with_tabs:!1,space_after_anon_function:!0,space_after_named_function:!0,space_before_conditional:!0,space_in_paren:!1}),E=h.parse(e).name,R=h.parse(e).dir,j=h.join(R,`${E}.js`);x.writeFile(j,H,"utf8",a=>{if(a){console.error(`Error writing file ${j}:`,a),r(a);return}this.verbose&&console.log(`Constructo file ${E}.js created successfully in ${R}.`),t(!0)})})}catch(o){r(o.message)}})}generateClassString(e,t,r,o,i){return`
    export class ${t} extends Constructos {
      ${e}
  constructor(elements, options) {
    super();
    /**@protected */
    this.identifier = this._getIdentifier(
      options ? options.identifier || "notSet" : "notSet"
    );
    const digestedPropsToString = this._mutableToString(elements);

    /**@protected */
    this.component = this.code(digestedPropsToString);

    this._saveUsingMutable(
      \`${r}-win-\${this.identifier}\`,
      elements,
      options,
      ${t}
    );
  }

  /**
   * Generate the HTML code for this constructo
   * @param props - The properties object containing all prop values
   * @returns The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return \`${o}\`;
  }

  /**
   * Create Winnetou Constructo
   * @param output The node or list of nodes where the component will be created
   * @param options Options to control how the construct is inserted. Optional.
   */
  create(output, options) {
    this.attachToDOM(this.component, output, options);
    return {
      ${i}
    };
  }

  /**
   * Get the constructo as a string
   * @returns The component HTML string
   */
  constructoString() {
    return this.component;
  }
}
`}};var y=class{constructor(e){this.entryFile=e.entryFile,this.outputDir=e.outputDir,this.watch=e.watch,this.production=e.production,this.verbose=e.verbose||!1,this.constructosSourceFolder=e.constructosSourceFolder,this.node=e.node||!1,this.verbose&&(console.log("production mode:",this.production?"\x1B[32myes\x1B[0m":"\x1B[31mno\x1B[0m"),console.log("watch mode:",this.watch?"\x1B[32myes\x1B[0m":"\x1B[31mno\x1B[0m"),console.log("node mode (SSR):",this.node?"\x1B[32myes\x1B[0m":"\x1B[31mno\x1B[0m"),console.log("output directory:",this.outputDir),console.log("entry file:",this.entryFile),console.log("constructos source folder:",e.constructosSourceFolder),this.production?console.log("Building in production mode..."):console.log("Building in development mode..."))}async build(){let e=new v({constructosSourceFolder:this.constructosSourceFolder,verbose:this.verbose});return await e.parse(),this.watch&&Y(this.constructosSourceFolder,{recursive:!0,filter:r=>r.endsWith(".wcto.htm")||r.endsWith("wcto.html")}).on("change",(r,o)=>{this.verbose&&console.log(`

\x1B[32mConstructo updated: `+o+"\x1B[0m"),e.singleParse(o)}),await this.esbuild()}async esbuild(){let e=await N.context({entryPoints:this.entryFile,platform:this.node?"node":"browser",bundle:!0,outdir:this.outputDir,splitting:!0,format:"esm",minify:this.production,sourcemap:!this.production,target:["chrome90"],entryNames:this.production?"[name].winnetouBundle.min":"[name]",chunkNames:this.production?"[hash].lazyBundle":"[name]-[hash].lazyBundle",loader:{".ts":"ts"},plugins:[{name:"detailed-build-notifier",setup:t=>{let r;t.onStart(()=>{r=performance.now(),console.log("\u{1F504} Starting build...")}),t.onEnd(o=>{let i=new Date().toLocaleTimeString(),f=r?`(${Math.round(performance.now()-r)}ms)`:"";o.errors.length>0?(console.log(`\u274C [${i}] Build failed ${f}`),o.errors.forEach(p=>console.log(`  Error: ${p.text}`))):o.warnings.length>0?(console.log(`\u26A0\uFE0F  [${i}] Build completed with warnings ${f}`),o.warnings.forEach(p=>console.log(`  Warning: ${p.text}`))):console.log(`\u2705 [${i}] Bundle rebuilt successfully! ${f}`)})}}]});return this.watch?(await e.watch(),"watching"):(await e.rebuild(),"done")}};var c;try{let u=g.join(__dirname,"win.config.json"),e=A.readFileSync(u,"utf8");c=JSON.parse(e)}catch{console.error("\x1B[31mError reading win.config.json\x1B[0m"),process.exit(1)}var C=class{constructor(){this.watch=!1;this.bundleRelease=!1;this.production=!1;this.entryFile=[];this.outputDir="";this.constructosSourceFolder="";console.log(`


\x1B[32mWinnetou Bundle Runtime (WBR) - Version 3\x1B[0m`),console.log("\x1B[33mhttps://winnetoujs.org\x1B[0m"),console.log("\x1B[34mInitializing WBR...\x1B[0m"),this.configureRuntime()}configureRuntime(){c.apps&&c.outputDir&&c.constructosSourceFolder?(this.outputDir=g.join(__dirname,c.outputDir),this.constructosSourceFolder=g.join(__dirname,c.constructosSourceFolder),c.apps.forEach(e=>{typeof e=="string"&&(e.endsWith(".ts")||e.endsWith(".js"))&&this.entryFile.push(g.join(__dirname,e))})):(console.error("\x1B[31mInvalid configuration in win.config.json\x1B[0m"),process.exit(1))}readArgs(){let e=new Z;e.name("wbr").description("Winnetou Bundle Runtime (WBR) - Version 3").version("3.0.0").option("-b,--bundleRelease","Compile project").option("-w, --watch","Watch mode").option("-p, --production","Production mode").option("-v, --verbose","Verbose output").option("-n, --node","Node platform for server-side rendering (SSR)").parse();let t=e.opts();if(Object.keys(t).length===0&&(e.help(),process.exit(1)),this.watch=!!t.watch,this.bundleRelease=!!t.bundleRelease,this.production=!!t.production,this.node=t.node,this.bundleRelease){let r={entryFile:this.entryFile,outputDir:this.outputDir,watch:this.watch,production:this.production,verbose:t.verbose,constructosSourceFolder:this.constructosSourceFolder,node:this.node};new y(r).build().then(o=>{o==="watching"?console.log("\x1B[34mWatching for changes...\x1B[0m"):(console.log("Build completed."),process.exit(0))}).catch(o=>{console.error("Error during bundle release:",o),process.exit(1)})}}},ee=new C;ee.readArgs();
/**
 * Winnetou Bundle Runtime (WBR) - Version 3
 * @license GNU General Public License v3.0
 * @description This file is part of the WBR project,
 * which is a runtime environment for executing Winnetou Bundle applications.
 * The WBR project is designed to provide a lightweight
 * and efficient platform for running applications built with
 * the Winnetou framework, focusing on performance and ease of use.
 * @author Pamela Sedrez (pamydev)
 * @version 3.0.0
 * @date 2025-07-01
 * https://github.com/pamydev
 * https://github.com/cedrosdev/winnetoujs
 * https://winnetoujs.org
 */
