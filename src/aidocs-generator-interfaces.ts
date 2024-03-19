import {OpenAI } from "openai";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as ts from "typescript";
import * as dotenv from "dotenv";
import { Command } from 'commander';
const program = new Command();


dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const claude = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
}); 

type ClassMethod = {
  className: string;
  methodName: string;
  methodSignature: string;
  comments: string; // Add this line to include comments
}

type ParseSettings = {
  className: string;
  file: string;
  exclude?: string[];
  include?: string[];
}

function parseDeclarations(settings: ParseSettings): ClassMethod[] {
  const filePath = settings.file;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );
  let classMethods: ClassMethod[] = [];

  function getLeadingComments(node: ts.Node): string {
    const fullText = node.getFullText(sourceFile);
    const comments = ts.getLeadingCommentRanges(fullText, 0);

    if (!comments) return '';
    let commentText = '';
    comments.forEach((comment) => {
      commentText += fullText.substring(comment.pos, comment.end) + '\n';
    });
    return commentText.trim();
  }

  function visit(node: ts.Node) {
    if ((ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)) && node.name) {

      if (settings.className && node.name.text !== settings.className) {
        return;
      }

      const className = node.name.text;
      node.members.forEach((member) => {
        if (ts.isMethodSignature(member) || ts.isMethodDeclaration(member)) {
          if (member.name) {
            let methodName = member.name.getText(sourceFile);

            if (settings.exclude && settings.exclude.includes(methodName)) {
              return;
            }

            if (settings.include && !settings.include.includes(methodName)) {
              return;
            }

            let methodSignature = member.getText(sourceFile);
            let comments = getLeadingComments(member);
            classMethods.push({ className, methodName, methodSignature, comments });
          }
        }
      });
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return classMethods;
}


type AiModel = 'claude' | 'gpt3' | 'gpt4'

async function createDocs(classMethods: ClassMethod[], aiModel: AiModel): Promise<void> {
    const fewShotExample = fs.readFileSync(`${__dirname}/wow.api.ts`);

    let currentClass = '';
    for (const { className, methodName, methodSignature, comments } of classMethods) {
      if (currentClass !== className) {
        // When we encounter a new class, we reset currentClass to the new className
        currentClass = className;
      }

      let content: string; 
      let response: any; 
      const prompt = `${fewShotExample}\n\n Use the provided examples of documenting methods and knowneldge of mod-eluna, azerothcore, create markdown docs for this method: \n\n declare class ${className} {\n Inline Code Comment: ${comments} Method: ${methodName} MethodSignature ${methodSignature}\n} the examples should be not be too simple, and have 10-20 lines`;
      switch(aiModel) {
        case 'gpt3':         
          response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: prompt}],                            
          });
            
          if(typeof response.choices[0].message.content == 'string') {
            content = response.choices[0].message.content;
          }
          break;
        case 'gpt4':
          response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [{ role: 'user', content: prompt}],                            
          });
          if(typeof response.choices[0].message.content == 'string') {
            content = response.choices[0].message.content;
          }
          break;
        case 'claude': 
          response = await claude.messages.create({
            model: 'claude-3-opus-20240229',
            max_tokens: 2000,
            messages: [{ role: "user", content: prompt}]            
          }); 
          if(typeof response.content[0].text == 'string') {
            content = response.content[0].text;
          }
          break;          
      }


      console.log(`writing documentation for ${className}.${methodName}`); 
      const documentation = content.replace(`filename: ${className.toLowerCase()}.md\n`, ''); 
      // Ensure directory exists
      const dir = './docs/wowapi/classes';
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      // Write to a separate markdown file for each class 
      fs.appendFileSync(`${dir}/${className}.md`, documentation + '\n\n');
    }
  }

  ( async() => {

    program
      .option('-m, --model <model>', 'The AI model to use for documentation generation. Options are gpt3, gpt4, claude', 'gpt3')
      .requiredOption('-f, --file <file>', 'The file to parse for class methods')
      .requiredOption('-c, --class <class>', 'Which classe to process from the file')
      .option('-e, --exclude <exclude>', 'The file to parse for class methods')
      .option('-i, --include <include>', 'The file to parse for class methods')
    program.parse();
  
    const options = program.opts();    
    const classOutputs = parseDeclarations({
      file: options.file,
      className: options.class,
      exclude: options.exclude ? options.exclude.split(',') : undefined,
      include: options.include ? options.include.split(',') : undefined
    }); 
    console.log(classOutputs); 
    await createDocs(classOutputs, options.model);  
  })(); 
