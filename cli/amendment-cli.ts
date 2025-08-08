#!/usr/bin/env node

/**
 * Amendment Management CLI
 * 
 * Command-line interface for democratic amendment workflows
 * Part of Option C: Democratic Amendment Workflows
 * 
 * @aegisFrameworkVersion: 2.4.0-beta
 * @intent: Provide user-friendly CLI for amendment management
 */

import { DemocraticAmendmentEngine } from "../framework/governance/democratic-amendment-engine.ts";

class AmendmentCLI {
  private engine: DemocraticAmendmentEngine;

  constructor() {
    this.engine = new DemocraticAmendmentEngine();
  }

  async createProposal(): Promise<void> {
    console.log("🗳️ Creating New Amendment Proposal");
    console.log("=================================");
    
    // In a real implementation, this would use interactive prompts
    // For demo, we'll create a sample proposal
    
    const sampleProposal = {
      title: "Enhanced AI Learning Integration",
      description: "Integrate AI learning capabilities more deeply into the constitutional framework",
      proposer: "core-team",
      type: 'constitutional' as const,
      impact: 'major' as const,
      proposedText: "Add Article X: AI Learning Integration - All framework components shall integrate with the AI learning system for continuous improvement and pattern recognition.",
      rationale: "The successful implementation of Pattern Recognition and Predictive Enforcement demonstrates the value of AI learning. This amendment formalizes AI integration as a constitutional requirement.",
      implementationPlan: [
        "Update CONSTITUTION.md with Article X",
        "Modify framework specifications to require AI integration",
        "Update validation tools to check AI learning compliance",
        "Create migration guide for existing components"
      ],
      migrationGuide: [
        "Review all existing framework components for AI integration opportunities",
        "Update blueprint templates to include AI learning hooks",
        "Migrate existing drift logs to new AI learning format"
      ]
    };

    try {
      const proposal = await this.engine.createAmendmentProposal(sampleProposal);
      console.log(`✅ Proposal created: ${proposal.id}`);
      console.log(`📋 Title: ${proposal.title}`);
      console.log(`⏰ Review period: ${proposal.reviewPeriod.durationDays} days`);
      console.log(`🎯 Impact: ${proposal.impact}`);
      
      return;
    } catch (error) {
      console.error(`❌ Failed to create proposal: ${error}`);
    }
  }

  async submitForReview(proposalId: string): Promise<void> {
    try {
      await this.engine.submitProposalForReview(proposalId);
      console.log(`✅ Proposal ${proposalId} submitted for community review`);
    } catch (error) {
      console.error(`❌ Failed to submit proposal: ${error}`);
    }
  }

  async addComment(proposalId: string, content: string, type: string = 'suggestion'): Promise<void> {
    try {
      await this.engine.addComment(proposalId, {
        author: 'community-member',
        content,
        type: type as any
      });
      console.log(`✅ Comment added to proposal ${proposalId}`);
    } catch (error) {
      console.error(`❌ Failed to add comment: ${error}`);
    }
  }

  async startVoting(proposalId: string): Promise<void> {
    try {
      await this.engine.startVoting(proposalId);
      console.log(`🗳️ Voting started for proposal ${proposalId}`);
    } catch (error) {
      console.error(`❌ Failed to start voting: ${error}`);
    }
  }

  async castVote(proposalId: string, decision: string, rationale?: string): Promise<void> {
    try {
      await this.engine.castVote(proposalId, {
        voter: 'core-team',
        decision: decision as any,
        rationale
      });
      console.log(`✅ Vote cast: ${decision} for proposal ${proposalId}`);
    } catch (error) {
      console.error(`❌ Failed to cast vote: ${error}`);
    }
  }

  async tallyVotes(proposalId: string): Promise<void> {
    try {
      const result = await this.engine.tallyVotes(proposalId);
      console.log("\n📊 Voting Results");
      console.log("================");
      console.log(`Total Votes: ${result.totalVotes}`);
      console.log(`Approvals: ${result.approvals}`);
      console.log(`Rejections: ${result.rejections}`);
      console.log(`Abstentions: ${result.abstentions}`);
      console.log(`Approval %: ${result.approvalPercentage.toFixed(1)}%`);
      console.log(`Quorum Met: ${result.quorumMet ? '✅ Yes' : '❌ No'}`);
      console.log(`Result: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    } catch (error) {
      console.error(`❌ Failed to tally votes: ${error}`);
    }
  }

  async finalizeAmendment(proposalId: string): Promise<void> {
    try {
      await this.engine.finalizeAmendment(proposalId);
      console.log(`🏛️ Amendment ${proposalId} finalized`);
    } catch (error) {
      console.error(`❌ Failed to finalize amendment: ${error}`);
    }
  }

  async demoWorkflow(): Promise<void> {
    console.log("🎭 Democratic Amendment Workflow Demo");
    console.log("===================================");
    
    try {
      // 1. Create proposal
      console.log("\n1️⃣ Creating amendment proposal...");
      await this.createProposal();
      
      // Get the most recent proposal
      const proposals = await this.engine.listProposals('draft');
      if (proposals.length === 0) {
        console.error("No proposals found");
        return;
      }
      
      const proposalId = proposals[0].id;
      console.log(`Working with proposal: ${proposalId}`);
      
      // 2. Submit for review
      console.log("\n2️⃣ Submitting for community review...");
      await this.submitForReview(proposalId);
      
      // 3. Add some comments
      console.log("\n3️⃣ Adding community feedback...");
      await this.addComment(proposalId, "This looks like a great improvement to the framework!", "support");
      await this.addComment(proposalId, "What about backward compatibility?", "question");
      await this.addComment(proposalId, "Suggest adding more detail to the implementation plan", "suggestion");
      
      // 4. Start voting (skip review period for demo)
      console.log("\n4️⃣ Starting voting period...");
      // Manually update the proposal to skip review period
      const proposal = await this.engine.getProposal(proposalId);
      if (proposal) {
        proposal.reviewPeriod.endDate = new Date(Date.now() - 1000).toISOString(); // Set to past
        await this.engine['saveProposal'](proposal); // Access private method for demo
      }
      
      await this.startVoting(proposalId);
      
      // 5. Cast some votes
      console.log("\n5️⃣ Casting votes...");
      await this.castVote(proposalId, "approve", "Strong support for AI integration");
      
        // Add more votes by directly manipulating the proposal (for demo)
        if (proposal) {
          const additionalVotes = [
            { voter: 'contributor', decision: 'approve' as const, rationale: 'Good direction', timestamp: new Date().toISOString(), weight: 2 },
            { voter: 'community', decision: 'approve' as const, rationale: 'Needed improvement', timestamp: new Date().toISOString(), weight: 1 },
            { voter: 'community-2', decision: 'abstain' as const, rationale: 'Need more time to review', timestamp: new Date().toISOString(), weight: 1 },
            { voter: 'community-3', decision: 'approve' as const, rationale: 'Excellent proposal', timestamp: new Date().toISOString(), weight: 1 }
          ];        proposal.voting.votes.push(...additionalVotes);
        proposal.voting.endDate = new Date(Date.now() - 1000).toISOString(); // End voting for demo
        await this.engine['saveProposal'](proposal);
      }
      
      // 6. Tally votes
      console.log("\n6️⃣ Tallying final votes...");
      await this.tallyVotes(proposalId);
      
      // 7. Finalize
      console.log("\n7️⃣ Finalizing amendment...");
      await this.finalizeAmendment(proposalId);
      
      console.log("\n🎉 Democratic workflow demonstration complete!");
      console.log("The amendment has been approved and implemented through democratic process.");
      
    } catch (error) {
      console.error(`❌ Demo workflow failed: ${error}`);
    }
  }

  showHelp(): void {
    console.log("🗳️ Amendment Management CLI");
    console.log("==========================");
    console.log("");
    console.log("Commands:");
    console.log("  create              - Create new amendment proposal");
    console.log("  submit <id>         - Submit proposal for review");
    console.log("  comment <id> <text> - Add comment to proposal");
    console.log("  vote <id> <decision> - Cast vote (approve/reject/abstain)");
    console.log("  tally <id>          - Tally votes for proposal");
    console.log("  finalize <id>       - Finalize amendment");
    console.log("  demo                - Run complete workflow demonstration");
    console.log("  status              - Show system status");
    console.log("  list [status]       - List proposals");
    console.log("  show <id>           - Show proposal details");
    console.log("");
    console.log("Example workflow:");
    console.log("  1. npm run amendment create");
    console.log("  2. npm run amendment submit <proposal-id>");
    console.log("  3. npm run amendment vote <proposal-id> approve");
    console.log("  4. npm run amendment finalize <proposal-id>");
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const cli = new AmendmentCLI();
  
  switch (command) {
    case 'create':
      await cli.createProposal();
      break;
      
    case 'submit':
      if (!args[1]) {
        console.error('Usage: submit <proposal-id>');
        process.exit(1);
      }
      await cli.submitForReview(args[1]);
      break;
      
    case 'comment':
      if (!args[1] || !args[2]) {
        console.error('Usage: comment <proposal-id> <comment-text>');
        process.exit(1);
      }
      await cli.addComment(args[1], args.slice(2).join(' '));
      break;
      
    case 'vote':
      if (!args[1] || !args[2]) {
        console.error('Usage: vote <proposal-id> <approve|reject|abstain> [rationale]');
        process.exit(1);
      }
      await cli.castVote(args[1], args[2], args.slice(3).join(' '));
      break;
      
    case 'tally':
      if (!args[1]) {
        console.error('Usage: tally <proposal-id>');
        process.exit(1);
      }
      await cli.tallyVotes(args[1]);
      break;
      
    case 'finalize':
      if (!args[1]) {
        console.error('Usage: finalize <proposal-id>');
        process.exit(1);
      }
      await cli.finalizeAmendment(args[1]);
      break;
      
    case 'demo':
      await cli.demoWorkflow();
      break;
      
    case 'status':
    case 'list':
    case 'show':
      // Delegate to the main engine CLI
      const { DemocraticAmendmentEngine } = await import("../framework/governance/democratic-amendment-engine.ts");
      const engine = new DemocraticAmendmentEngine();
      
      if (command === 'status') {
        const status = await engine.getDemocraticStatus();
        console.log("🗳️ Democratic Amendment System Status");
        console.log("===================================");
        console.log(`Active Proposals: ${status.activeProposals}`);
        console.log(`Pending Votes: ${status.pendingVotes}`);
        console.log(`System Health: ${status.systemHealth}`);
        if (status.recentActivity.length > 0) {
          console.log("\nRecent Activity:");
          status.recentActivity.forEach(activity => console.log(`  ${activity}`));
        }
      } else if (command === 'list') {
        const proposals = await engine.listProposals(args[1]);
        console.log(`\n📋 Amendment Proposals (${proposals.length})`);
        proposals.forEach(p => {
          console.log(`  ${p.id}: ${p.title} [${p.status}]`);
        });
      } else if (command === 'show') {
        if (!args[1]) {
          console.error('Usage: show <proposal-id>');
          process.exit(1);
        }
        const proposal = await engine.getProposal(args[1]);
        if (proposal) {
          engine.displayProposal(proposal);
        } else {
          console.error(`Proposal ${args[1]} not found`);
        }
      }
      break;
      
    default:
      await       cli.showHelp();
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AmendmentCLI };
