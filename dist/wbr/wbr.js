"use strict";var oe=Object.create;var A=Object.defineProperty;var re=Object.getOwnPropertyDescriptor;var ne=Object.getOwnPropertyNames;var se=Object.getPrototypeOf,ie=Object.prototype.hasOwnProperty;var ce=(n,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of ne(e))!ie.call(n,o)&&o!==t&&A(n,o,{get:()=>e[o],enumerable:!(r=re(e,o))||r.enumerable});return n};var a=(n,e,t)=>(t=n!=null?oe(se(n)):{},ce(e||!n||!n.__esModule?A(t,"default",{value:n,enumerable:!0}):t,n));var V=require("commander"),f=a(require("path")),G=a(require("fs"));var q=a(require("esbuild")),J=a(require("node-watch"));var H=a(require("recursive-readdir")),y=a(require("fs")),g=a(require("path")),z=require("node-html-parser"),k=a(require("escape-string-regexp")),E=require("js-beautify"),x=class{constructor(e){this.constructosSourceFolder=e.constructosSourceFolder,this.verbose=e.verbose||!1,this.promisesConstructos=[],this.idList=[]}async singleParse(e){this.idList=[],await this.transpileConstructo(e)}async parse(){return(await(0,H.default)(this.constructosSourceFolder)).forEach(t=>{(t.endsWith(".wcto.html")||t.endsWith(".wcto.htm"))&&(this.verbose&&console.log("Parsing constructo file:",t),this.promisesConstructos.push(this.transpileConstructo(t)))}),await Promise.all(this.promisesConstructos),this.verbose&&console.log(`\x1B[34mParsed ${this.promisesConstructos.length} constructo files successfully.\x1B[0m`),!0}async transpileConstructo(e){return new Promise((t,r)=>{try{y.readFile(e,"utf8",(o,c)=>{if(o){r(o);return}let d=(0,z.parse)(c.toString()).querySelectorAll("winnetou"),$="";Array.from(d).forEach(u=>{let K=u.getAttribute("description"),_=u.innerHTML,s=`

// ========================================`;s+=`
/**
`,s+=`	* ${K||""}
`;let P=!1,I=!1,T="",p;try{let i=_.match(/\[\[\s?(.*?)\s?\]\]/);if(i)p=i[1];else{console.error(`\x1B[31mError: Constructo ID not found in ${e}. Please ensure it is defined as [[id]].\x1B[0m`);return}}catch{console.error(`Error: Failed to parse ${e}.`);return}let ue=p+"-win-${this.identifier}";this.idList.filter(i=>i.id===p).length>0&&console.error(`Error: Duplicate Constructo ID found in ${e}.`),this.idList.push({file:e,id:p});let Q=/\[\[\s*?(.*?)\s*?\]\]/g,W=_.match(Q)||[],m="";W.length?(m="ids: {",W.map(h=>h.replace("[[","").replace("]]","")).forEach(h=>{m+=`${h}: \`${h}-win-\${this.identifier}\`,`}),m+="},"):m="";let w=_.replace(/\[\[\s*?(.*?)\s*?\]\]/g,"$1-win-${this.identifier}"),X=new RegExp("{{\\s*?(.*?)\\s*?}}","g"),L=w.match(X),Y=[];L&&(I=!0,L.forEach(i=>{let F=i.replace("{{","").replace("}}","").split(":"),M=F[0].split("("),O=F[1]||"",N=F[0].indexOf("?")===-1;N&&(P=!0);let v=M[0].replace("?","").trim();Y.push(v);let C=M[1]||"";C=C.replace(")",""),T+=`	* @param {${O||"any"}} ${N?`elements.${v}`:`[elements.${v}]`}  ${C.trim()}
`;let te=(0,k.default)(i);w=w.replace(new RegExp(te,"g"),`\${props?.${v} || ""}`)})),I&&P?s+=`	* @param {object} elements
`:s+=`	* @param {object} [elements]
`,s+=T,s+=`	* @param {object} [options]
`,s+=`	* @param {string} [options.identifier]
`,s+=`	*/
`;let Z=`$${p}`,ee=this.generateClassString(s,Z,p,w,m);$+=ee});let le=(0,E.js)($,{indent_size:1,space_in_empty_paren:!0}),U=(0,E.js)(`
            import {Constructos} from "winnetoujs/core/constructos";
            


            ${$}
          `,{indent_size:1,space_in_empty_paren:!0,preserve_newlines:!1,end_with_newline:!0,max_preserve_newlines:1,wrap_line_length:50,eol:`
`,indent_with_tabs:!1,space_after_anon_function:!0,space_after_named_function:!0,space_before_conditional:!0,space_in_paren:!1}),j=g.parse(e).name,B=g.parse(e).dir,D=g.join(B,`${j}.js`);y.writeFile(D,U,"utf8",u=>{if(u){console.error(`Error writing file ${D}:`,u),r(u);return}this.verbose&&console.log(`Constructo file ${j}.js created successfully in ${B}.`),t(!0)})})}catch(o){r(o.message)}})}generateClassString(e,t,r,o,c){return`
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
      ${c}
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
`}};var S=class{constructor(e){this.entryFile=e.entryFile,this.outputDir=e.outputDir,this.watch=e.watch,this.production=e.production,this.verbose=e.verbose||!1,this.constructosSourceFolder=e.constructosSourceFolder,this.node=e.node||!1,this.verbose&&(console.log("production mode:",this.production?"\x1B[32myes\x1B[0m":"\x1B[31mno\x1B[0m"),console.log("watch mode:",this.watch?"\x1B[32myes\x1B[0m":"\x1B[31mno\x1B[0m"),console.log("node mode (SSR):",this.node?"\x1B[32myes\x1B[0m":"\x1B[31mno\x1B[0m"),console.log("output directory:",this.outputDir),console.log("entry file:",this.entryFile),console.log("constructos source folder:",e.constructosSourceFolder),this.production?console.log("Building in production mode..."):console.log("Building in development mode..."))}async build(){let e=new x({constructosSourceFolder:this.constructosSourceFolder,verbose:this.verbose});return await e.parse(),this.watch&&(0,J.default)(this.constructosSourceFolder,{recursive:!0,filter:r=>r.endsWith(".wcto.htm")||r.endsWith("wcto.html")}).on("change",(r,o)=>{this.verbose&&console.log(`

\x1B[32mConstructo updated: `+o+"\x1B[0m"),e.singleParse(o)}),await this.esbuild()}async esbuild(){let e=await q.context({entryPoints:this.entryFile,platform:this.node?"node":"browser",bundle:!0,outdir:this.outputDir,splitting:!0,format:"esm",minify:this.production,sourcemap:!this.production,target:["chrome90"],entryNames:this.production?"[name].winnetouBundle.min":"[name]",chunkNames:this.production?"[hash].lazyBundle":"[name]-[hash].lazyBundle",loader:{".ts":"ts"},plugins:[{name:"detailed-build-notifier",setup:t=>{let r;t.onStart(()=>{r=performance.now(),console.log("\u{1F504} Starting build...")}),t.onEnd(o=>{let c=new Date().toLocaleTimeString(),b=r?`(${Math.round(performance.now()-r)}ms)`:"";o.errors.length>0?(console.log(`\u274C [${c}] Build failed ${b}`),o.errors.forEach(d=>console.log(`  Error: ${d.text}`))):o.warnings.length>0?(console.log(`\u26A0\uFE0F  [${c}] Build completed with warnings ${b}`),o.warnings.forEach(d=>console.log(`  Warning: ${d.text}`))):console.log(`\u2705 [${c}] Bundle rebuilt successfully! ${b}`)})}}]});return this.watch?(await e.watch(),"watching"):(await e.rebuild(),"done")}};var l;try{let n=f.join(__dirname,"win.config.json"),e=G.readFileSync(n,"utf8");l=JSON.parse(e)}catch{console.error("\x1B[31mError reading win.config.json\x1B[0m"),process.exit(1)}var R=class{constructor(){this.watch=!1;this.bundleRelease=!1;this.production=!1;this.entryFile=[];this.outputDir="";this.constructosSourceFolder="";console.log(`


\x1B[32mWinnetou Bundle Runtime (WBR) - Version 3\x1B[0m`),console.log("\x1B[33mhttps://winnetoujs.org\x1B[0m"),console.log("\x1B[34mInitializing WBR...\x1B[0m"),this.configureRuntime()}configureRuntime(){l.apps&&l.outputDir&&l.constructosSourceFolder?(this.outputDir=f.join(__dirname,l.outputDir),this.constructosSourceFolder=f.join(__dirname,l.constructosSourceFolder),l.apps.forEach(e=>{typeof e=="string"&&(e.endsWith(".ts")||e.endsWith(".js"))&&this.entryFile.push(f.join(__dirname,e))})):(console.error("\x1B[31mInvalid configuration in win.config.json\x1B[0m"),process.exit(1))}readArgs(){let e=new V.Command;e.name("wbr").description("Winnetou Bundle Runtime (WBR) - Version 3").version("3.0.0").option("-b,--bundleRelease","Compile project").option("-w, --watch","Watch mode").option("-p, --production","Production mode").option("-v, --verbose","Verbose output").option("-n, --node","Node platform for server-side rendering (SSR)").parse();let t=e.opts();if(Object.keys(t).length===0&&(e.help(),process.exit(1)),this.watch=!!t.watch,this.bundleRelease=!!t.bundleRelease,this.production=!!t.production,this.node=t.node,this.bundleRelease){let r={entryFile:this.entryFile,outputDir:this.outputDir,watch:this.watch,production:this.production,verbose:t.verbose,constructosSourceFolder:this.constructosSourceFolder,node:this.node};new S(r).build().then(o=>{o==="watching"?console.log("\x1B[34mWatching for changes...\x1B[0m"):(console.log("Build completed."),process.exit(0))}).catch(o=>{console.error("Error during bundle release:",o),process.exit(1)})}}},ae=new R;ae.readArgs();
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
