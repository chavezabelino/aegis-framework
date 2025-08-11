#!/usr/bin/env node

/**
 * @aegisFrameworkVersion 2.0.0-alpha-dev
 * @intent CLI tool for generating standardized evolution stories
 * @context Streamlines documentation of field-driven framework insights
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function generateEvolutionStory() {
  console.log('🔄 Aegis Framework Evolution Story Generator');
  console.log('📋 Creating standardized documentation for field-driven insights\n');

  // Collect metadata
  const title = await prompt('📝 Evolution Story Title: ');
  const triggerType = await prompt('🎯 Trigger Type (field-usage/audit/migration/user-question): ');
  const impactLevel = await prompt('📊 Impact Level (patch/minor/major/constitutional): ');
  const fieldUser = await prompt('👤 Field User Identifier (optional): ');
  const frameworkVersion = (await prompt('🏷️  Framework Version (default: 2.0.0-alpha-dev): ')) || '2.0.0-alpha-dev';

  // Generate story ID
  const today = new Date().toISOString().split('T')[0];
  const sequence = '001'; // Simple sequence for now
  const storyId = `EVS-${today}-${sequence}`;

  // Collect story details
  console.log('\n🌱 Field Context:');
  const scenario = await prompt('   Real-world scenario: ');
  const userWorkflow = await prompt('   User workflow exposed: ');
  const expectationVsReality = await prompt('   Expectation vs Reality: ');

  console.log('\n🔍 Gap Identification:');
  const triggerMoment = await prompt('   Exact trigger moment: ');
  const userConcern = await prompt('   User question/concern: ');
  const frameworkLimitation = await prompt('   Framework limitation exposed: ');

  console.log('\n🧠 Insight Analysis:');
  const rootCause = await prompt('   Root cause: ');
  const patternRecognition = await prompt('   Pattern recognition: ');
  const constitutionalImplications = await prompt('   Constitutional implications: ');

  console.log('\n🛠️ Solution Design:');
  const proposedEnhancement = await prompt('   Proposed enhancement: ');
  const implementationStrategy = await prompt('   Implementation strategy: ');

  // Generate the evolution story
  const storyContent = `<!--
@aegisFrameworkVersion: ${frameworkVersion}
@intent: Evolution Story - ${title}
@context: Field-driven framework evolution documentation
-->

# ${storyId}: ${title}

## 📊 Story Metadata
\`\`\`yaml
evolutionStory:
  id: "${storyId}"
  title: "${title}"
  date: "${today}"
  frameworkVersion: "${frameworkVersion}"
  triggerType: "${triggerType}"
  impactLevel: "${impactLevel}"
  
  participants:
    fieldUser: "${fieldUser || 'anonymous'}"
    frameworkMaintainer: "github-copilot"
    
  artifactsGenerated:
    - "TBD - to be filled during implementation"
\`\`\`

## 🌱 Field Context

### **Real-World Scenario**
${scenario}

### **User Workflow Exposed**
${userWorkflow}

### **Expectation vs Reality**
${expectationVsReality}

## 🔍 Gap Identification

### **Exact Trigger Moment**
${triggerMoment}

### **User Concern**
${userConcern}

### **Framework Limitation Exposed**
${frameworkLimitation}

## 🧠 Insight Analysis

### **Root Cause**
${rootCause}

### **Pattern Recognition**
${patternRecognition}

### **Constitutional Implications**
${constitutionalImplications}

## 🛠️ Solution Design

### **Proposed Enhancement**
${proposedEnhancement}

### **Implementation Strategy**
${implementationStrategy}

### **Constitutional Compliance Assessment**
*To be completed during implementation*

## 🚀 Implementation Impact

### **Code Changes Summary**
*To be documented during implementation*

### **User Workflow Improvements**
*To be documented after implementation*

### **Framework Capability Expansion**
*To be documented after implementation*

## 🔮 Future Implications

### **Patterns to Watch**
*To be analyzed during implementation*

### **Preventive Measures Established**
*To be documented during implementation*

### **Meta-Learning Captured**
*To be completed after implementation*

## 📈 Success Metrics

### **Immediate Protection**
*To be defined during implementation*

### **Framework Maturation**
*To be measured after implementation*

---

**Story Status**: 🚧 In Development  
**Framework Impact**: ${impactLevel}  
**Evolution Pattern**: Field-Driven Framework Enhancement

*This story will be updated as implementation progresses and completed when the enhancement is constitutionally ratified.*
`;

  // Create the file
  const fileName = `${storyId.toLowerCase()}-${title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')}.md`;
  const filePath = path.join('docs', 'evolution', fileName);

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, storyContent);

  console.log(`\n✅ Evolution Story created: ${filePath}`);
  console.log(`📋 Story ID: ${storyId}`);
  console.log(`🏛️ Constitutional Impact: ${impactLevel}`);
  console.log('\n🔄 Next Steps:');
  console.log('   1. Complete implementation sections as work progresses');
  console.log('   2. Update artifactsGenerated list with actual files created');
  console.log('   3. Document success metrics and lessons learned');
  console.log('   4. Link to specific commits and releases');

  if (impactLevel === 'constitutional') {
    console.log('\n⚖️ Constitutional Impact Detected:');
    console.log('   - This story will require governance review');
    console.log('   - Constitutional amendments must reference this story');
    console.log('   - Consider scheduling constitutional committee review');
  }

  rl.close();
}

// CLI interface
if (require.main === module) {
  generateEvolutionStory().catch(console.error);
}

module.exports = { generateEvolutionStory };
