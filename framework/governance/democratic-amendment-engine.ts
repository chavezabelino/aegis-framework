#!/usr/bin/env node

/**
 * Democratic Amendment Workflow Engine
 *
 * Community-driven constitutional amendment proposal, review, and voting system
 * Part of Option C: Democratic Amendment Workflows
 *
 * @aegisFrameworkVersion: 2.4.0-beta
 * @intent: Implement democratic governance for constitutional amendments
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface AmendmentProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  proposedDate: string;
  status: 'draft' | 'proposed' | 'under-review' | 'voting' | 'approved' | 'rejected' | 'implemented';
  type: 'constitutional' | 'framework-spec' | 'governance-process' | 'enforcement-rule';
  impact: 'breaking' | 'major' | 'minor' | 'patch';
  version: string;

  // Amendment content
  currentText?: string;
  proposedText: string;
  rationale: string;
  implementationPlan: string[];
  migrationGuide: string[];

  // Democratic process
  reviewPeriod: {
    startDate: string;
    endDate: string;
    durationDays: number;
  };

  voting: {
    startDate?: string;
    endDate?: string;
    votes: Vote[];
    quorum: number;
    threshold: number; // percentage needed to pass
  };

  // Tracking
  comments: Comment[];
  revisions: AmendmentRevision[];
  supporters: string[];
  metadata: AmendmentMetadata;
}

interface Vote {
  voter: string;
  decision: 'approve' | 'reject' | 'abstain';
  rationale?: string;
  timestamp: string;
  weight: number; // voting weight based on contribution/role
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: 'suggestion' | 'concern' | 'support' | 'question';
  resolved: boolean;
  replies: Comment[];
}

interface AmendmentRevision {
  version: number;
  changes: string;
  timestamp: string;
  reason: string;
}

interface AmendmentMetadata {
  relatedArticles: string[];
  affectedFiles: string[];
  testingRequired: boolean;
  communityDiscussionUrl?: string;
  precedents: string[];
}

interface VotingResult {
  totalVotes: number;
  approvals: number;
  rejections: number;
  abstentions: number;
  approvalPercentage: number;
  quorumMet: boolean;
  passed: boolean;
  summary: string;
}

class DemocraticAmendmentEngine {
  private frameworkRoot: string;
  private proposalsPath: string;
  private votersRegistry: Map<string, VoterProfile> = new Map();

  constructor(frameworkRoot: string = process.cwd()) {
    this.frameworkRoot = frameworkRoot;
    this.proposalsPath = path.join(frameworkRoot, 'framework/governance/amendment-proposals');
    this.initializeVotersRegistry();
  }

  async createAmendmentProposal(proposal: Partial<AmendmentProposal>): Promise<AmendmentProposal> {
    console.log('🗳️ Creating new amendment proposal...');

    const proposalId = this.generateProposalId(proposal.title || 'untitled');
    const reviewDays = this.calculateReviewPeriod(proposal.impact || 'minor');
    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + reviewDays * 24 * 60 * 60 * 1000).toISOString();

    const fullProposal: AmendmentProposal = {
      id: proposalId,
      title: proposal.title || 'Untitled Amendment',
      description: proposal.description || '',
      proposer: proposal.proposer || 'anonymous',
      proposedDate: startDate,
      status: 'draft',
      type: proposal.type || 'framework-spec',
      impact: proposal.impact || 'minor',
      version: this.loadCurrentVersion(),

      proposedText: proposal.proposedText || '',
      rationale: proposal.rationale || '',
      implementationPlan: proposal.implementationPlan || [],
      migrationGuide: proposal.migrationGuide || [],

      reviewPeriod: {
        startDate,
        endDate,
        durationDays: reviewDays,
      },

      voting: {
        votes: [],
        quorum: this.calculateQuorum(proposal.impact || 'minor'),
        threshold: this.calculateThreshold(proposal.impact || 'minor'),
      },

      comments: [],
      revisions: [],
      supporters: [],
      metadata: {
        relatedArticles: [],
        affectedFiles: [],
        testingRequired: this.requiresTesting(proposal.impact || 'minor'),
        precedents: [],
      },
    };

    await this.saveProposal(fullProposal);
    console.log(`✅ Amendment proposal ${proposalId} created successfully`);

    return fullProposal;
  }

  async submitProposalForReview(proposalId: string): Promise<void> {
    console.log(`📋 Submitting proposal ${proposalId} for community review...`);

    const proposal = await this.loadProposal(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    // Validate proposal completeness
    await this.validateProposalCompleteness(proposal);

    // Update status and timing
    proposal.status = 'under-review';
    proposal.reviewPeriod.startDate = new Date().toISOString();
    proposal.reviewPeriod.endDate = new Date(
      Date.now() + proposal.reviewPeriod.durationDays * 24 * 60 * 60 * 1000
    ).toISOString();

    await this.saveProposal(proposal);
    await this.notifyCommunity(proposal, 'review-started');

    console.log(`🔍 Proposal ${proposalId} is now under community review`);
    console.log(`📅 Review period: ${proposal.reviewPeriod.durationDays} days`);
  }

  async addComment(proposalId: string, comment: Partial<Comment>): Promise<void> {
    console.log(`💬 Adding comment to proposal ${proposalId}...`);

    const proposal = await this.loadProposal(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: comment.author || 'anonymous',
      content: comment.content || '',
      timestamp: new Date().toISOString(),
      type: comment.type || 'suggestion',
      resolved: false,
      replies: [],
    };

    proposal.comments.push(newComment);
    await this.saveProposal(proposal);

    console.log(`✅ Comment added to proposal ${proposalId}`);
  }

  async startVoting(proposalId: string): Promise<void> {
    console.log(`🗳️ Starting voting period for proposal ${proposalId}...`);

    const proposal = await this.loadProposal(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    // Validate review period completed
    if (new Date() < new Date(proposal.reviewPeriod.endDate)) {
      throw new Error('Review period has not completed yet');
    }

    // Check for unresolved critical concerns
    const unresolvedCritical = proposal.comments.filter(c => !c.resolved && c.type === 'concern');

    if (unresolvedCritical.length > 0) {
      console.warn(`⚠️ ${unresolvedCritical.length} unresolved concerns detected`);
    }

    // Start voting
    const votingDays = this.calculateVotingPeriod(proposal.impact);
    proposal.status = 'voting';
    proposal.voting.startDate = new Date().toISOString();
    proposal.voting.endDate = new Date(Date.now() + votingDays * 24 * 60 * 60 * 1000).toISOString();

    await this.saveProposal(proposal);
    await this.notifyCommunity(proposal, 'voting-started');

    console.log(`🗳️ Voting period started for ${votingDays} days`);
    console.log(`📊 Quorum required: ${proposal.voting.quorum} votes`);
    console.log(`📈 Threshold: ${proposal.voting.threshold}% approval`);
  }

  async castVote(proposalId: string, vote: Partial<Vote>): Promise<void> {
    console.log(`🗳️ Casting vote for proposal ${proposalId}...`);

    const proposal = await this.loadProposal(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    if (proposal.status !== 'voting') {
      throw new Error('Proposal is not in voting phase');
    }

    if (new Date() > new Date(proposal.voting.endDate!)) {
      throw new Error('Voting period has ended');
    }

    // Validate voter
    const voter = vote.voter || 'anonymous';
    if (!this.isEligibleVoter(voter)) {
      throw new Error(`Voter ${voter} is not eligible to vote`);
    }

    // Check for duplicate vote
    const existingVote = proposal.voting.votes.find(v => v.voter === voter);
    if (existingVote) {
      throw new Error(`Voter ${voter} has already voted`);
    }

    // Create vote
    const newVote: Vote = {
      voter,
      decision: vote.decision || 'abstain',
      rationale: vote.rationale,
      timestamp: new Date().toISOString(),
      weight: this.calculateVotingWeight(voter),
    };

    proposal.voting.votes.push(newVote);
    await this.saveProposal(proposal);

    console.log(`✅ Vote recorded: ${newVote.decision} (weight: ${newVote.weight})`);
  }

  async tallyVotes(proposalId: string): Promise<VotingResult> {
    console.log(`📊 Tallying votes for proposal ${proposalId}...`);

    const proposal = await this.loadProposal(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    const votes = proposal.voting.votes;
    const totalVotes = votes.length;

    // Calculate weighted votes
    const approvals = votes.filter(v => v.decision === 'approve').reduce((sum, v) => sum + v.weight, 0);
    const rejections = votes.filter(v => v.decision === 'reject').reduce((sum, v) => sum + v.weight, 0);
    const abstentions = votes.filter(v => v.decision === 'abstain').reduce((sum, v) => sum + v.weight, 0);

    const totalWeight = approvals + rejections + abstentions;
    const approvalPercentage = totalWeight > 0 ? (approvals / totalWeight) * 100 : 0;

    const quorumMet = totalVotes >= proposal.voting.quorum;
    const passed = quorumMet && approvalPercentage >= proposal.voting.threshold;

    const result: VotingResult = {
      totalVotes,
      approvals,
      rejections,
      abstentions,
      approvalPercentage,
      quorumMet,
      passed,
      summary: this.generateVotingSummary(proposal, {
        approvals,
        rejections,
        abstentions,
        approvalPercentage,
        quorumMet,
        passed,
      }),
    };

    console.log(`📊 Voting Results:`);
    console.log(`  Total Votes: ${totalVotes}`);
    console.log(`  Approvals: ${approvals}`);
    console.log(`  Rejections: ${rejections}`);
    console.log(`  Approval %: ${approvalPercentage.toFixed(1)}%`);
    console.log(`  Quorum Met: ${quorumMet ? '✅' : '❌'}`);
    console.log(`  Result: ${passed ? '✅ PASSED' : '❌ FAILED'}`);

    return result;
  }

  async finalizeAmendment(proposalId: string): Promise<void> {
    console.log(`🏛️ Finalizing amendment ${proposalId}...`);

    const proposal = await this.loadProposal(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    if (proposal.status !== 'voting') {
      throw new Error('Proposal must be in voting phase to finalize');
    }

    // Check if voting period ended
    if (new Date() <= new Date(proposal.voting.endDate!)) {
      throw new Error('Voting period has not ended yet');
    }

    // Tally final votes
    const result = await this.tallyVotes(proposalId);

    if (result.passed) {
      proposal.status = 'approved';
      await this.implementAmendment(proposal);
      console.log(`✅ Amendment ${proposalId} approved and implemented`);
    } else {
      proposal.status = 'rejected';
      console.log(`❌ Amendment ${proposalId} rejected`);
    }

    await this.saveProposal(proposal);
    await this.notifyCommunity(proposal, 'voting-completed');
    await this.recordAmendmentHistory(proposal, result);
  }

  async listProposals(status?: string): Promise<AmendmentProposal[]> {
    console.log('📋 Listing amendment proposals...');

    const proposalsDir = this.proposalsPath;
    if (!fs.existsSync(proposalsDir)) {
      return [];
    }

    const files = fs.readdirSync(proposalsDir).filter(f => f.endsWith('.json'));
    const proposals: AmendmentProposal[] = [];

    for (const file of files) {
      try {
        const filePath = path.join(proposalsDir, file);
        const proposal = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!status || proposal.status === status) {
          proposals.push(proposal);
        }
      } catch (error) {
        console.warn(`⚠️ Could not load proposal from ${file}`);
      }
    }

    console.log(`📊 Found ${proposals.length} proposals${status ? ` with status: ${status}` : ''}`);
    return proposals.sort((a, b) => new Date(b.proposedDate).getTime() - new Date(a.proposedDate).getTime());
  }

  async getDemocraticStatus(): Promise<{
    activeProposals: number;
    pendingVotes: number;
    recentActivity: string[];
    systemHealth: string;
  }> {
    const allProposals = await this.listProposals();
    const activeProposals = allProposals.filter(p => ['under-review', 'voting'].includes(p.status)).length;

    const pendingVotes = allProposals.filter(p => p.status === 'voting').length;

    const recentActivity = allProposals.slice(0, 5).map(p => `${p.id}: ${p.status} (${p.title})`);

    const systemHealth = this.assessDemocraticHealth(allProposals);

    return {
      activeProposals,
      pendingVotes,
      recentActivity,
      systemHealth,
    };
  }

  // Helper methods
  private generateProposalId(title: string): string {
    const sanitized = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .substring(0, 30);
    const timestamp = Date.now().toString(36);
    return `amendment-${sanitized}-${timestamp}`;
  }

  private calculateReviewPeriod(impact: string): number {
    switch (impact) {
      case 'breaking':
        return 21; // 3 weeks
      case 'major':
        return 14; // 2 weeks
      case 'minor':
        return 7; // 1 week
      case 'patch':
        return 3; // 3 days
      default:
        return 7;
    }
  }

  private calculateVotingPeriod(impact: string): number {
    switch (impact) {
      case 'breaking':
        return 14; // 2 weeks
      case 'major':
        return 7; // 1 week
      case 'minor':
        return 5; // 5 days
      case 'patch':
        return 3; // 3 days
      default:
        return 5;
    }
  }

  private calculateQuorum(impact: string): number {
    switch (impact) {
      case 'breaking':
        return 10; // High participation required
      case 'major':
        return 7;
      case 'minor':
        return 5;
      case 'patch':
        return 3;
      default:
        return 5;
    }
  }

  private calculateThreshold(impact: string): number {
    switch (impact) {
      case 'breaking':
        return 75; // 75% approval
      case 'major':
        return 66; // 2/3 majority
      case 'minor':
        return 60; // 60% approval
      case 'patch':
        return 50; // Simple majority
      default:
        return 60;
    }
  }

  private requiresTesting(impact: string): boolean {
    return ['breaking', 'major'].includes(impact);
  }

  private loadCurrentVersion(): string {
    try {
      const versionPath = path.join(this.frameworkRoot, 'VERSION');
      return fs.readFileSync(versionPath, 'utf8').trim();
    } catch {
      return '1.1.0-beta';
    }
  }

  private initializeVotersRegistry(): void {
    // In a real implementation, this would load from a registry
    // For now, we'll use a simple in-memory setup
    this.votersRegistry.set('core-team', { weight: 3, role: 'maintainer' });
    this.votersRegistry.set('contributor', { weight: 2, role: 'contributor' });
    this.votersRegistry.set('community', { weight: 1, role: 'community' });
  }

  private isEligibleVoter(voter: string): boolean {
    // Simple eligibility check - in practice would be more sophisticated
    return this.votersRegistry.has(voter) || voter.includes('@') || voter.length > 3;
  }

  private calculateVotingWeight(voter: string): number {
    const profile = this.votersRegistry.get(voter);
    return profile?.weight || 1;
  }

  private async validateProposalCompleteness(proposal: AmendmentProposal): Promise<void> {
    const required = ['title', 'description', 'proposedText', 'rationale'];
    const missing = required.filter(field => !proposal[field as keyof AmendmentProposal]);

    if (missing.length > 0) {
      throw new Error(`Proposal incomplete: missing ${missing.join(', ')}`);
    }
  }

  private generateVotingSummary(proposal: AmendmentProposal, result: any): string {
    return `Amendment "${proposal.title}" ${result.passed ? 'PASSED' : 'FAILED'} with ${result.approvalPercentage.toFixed(1)}% approval (${result.approvals}/${result.approvals + result.rejections} votes)`;
  }

  private assessDemocraticHealth(proposals: AmendmentProposal[]): string {
    const recentProposals = proposals.filter(
      p => Date.now() - new Date(p.proposedDate).getTime() < 30 * 24 * 60 * 60 * 1000
    );

    if (recentProposals.length === 0) return 'Quiet period';
    if (recentProposals.length >= 5) return 'Active engagement';
    return 'Normal activity';
  }

  async getProposal(proposalId: string): Promise<AmendmentProposal | null> {
    return this.loadProposal(proposalId);
  }

  private async saveProposal(proposal: AmendmentProposal): Promise<void> {
    const dir = this.proposalsPath;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `${proposal.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(proposal, null, 2));
  }

  private async loadProposal(proposalId: string): Promise<AmendmentProposal | null> {
    try {
      const filePath = path.join(this.proposalsPath, `${proposalId}.json`);
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      return null;
    }
  }

  private async notifyCommunity(proposal: AmendmentProposal, event: string): Promise<void> {
    // In practice, this would send notifications to community channels
    console.log(`📢 Community notification: ${event} for ${proposal.id}`);
  }

  private async implementAmendment(proposal: AmendmentProposal): Promise<void> {
    console.log(`🔧 Implementing amendment: ${proposal.title}`);

    // In practice, this would:
    // 1. Update constitutional documents
    // 2. Modify framework specifications
    // 3. Update governance processes
    // 4. Run tests and validation

    proposal.status = 'implemented';

    // Record implementation
    const implementationLog = {
      amendmentId: proposal.id,
      implementedDate: new Date().toISOString(),
      implementedBy: 'democratic-process',
      version: proposal.version,
      changes: proposal.implementationPlan,
    };

    console.log(`✅ Amendment ${proposal.id} implemented successfully`);
  }

  private async recordAmendmentHistory(proposal: AmendmentProposal, result: VotingResult): Promise<void> {
    const historyPath = path.join(this.frameworkRoot, 'framework/governance/amendment-history.json');

    let history: any[] = [];
    if (fs.existsSync(historyPath)) {
      history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }

    history.push({
      proposalId: proposal.id,
      title: proposal.title,
      result: result.passed ? 'approved' : 'rejected',
      votingResult: result,
      finalizedDate: new Date().toISOString(),
    });

    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
    console.log(`📚 Amendment history updated`);
  }

  displayProposal(proposal: AmendmentProposal): void {
    console.log(`\n🗳️ Amendment Proposal: ${proposal.id}`);
    console.log('=====================================');
    console.log(`Title: ${proposal.title}`);
    console.log(`Status: ${proposal.status}`);
    console.log(`Type: ${proposal.type} (${proposal.impact} impact)`);
    console.log(`Proposer: ${proposal.proposer}`);
    console.log(`Proposed: ${new Date(proposal.proposedDate).toLocaleDateString()}`);
    console.log('');
    console.log(`Description: ${proposal.description}`);
    console.log('');
    console.log(`Rationale: ${proposal.rationale}`);

    if (proposal.status === 'under-review' || proposal.status === 'voting') {
      console.log('');
      console.log(
        `Review Period: ${new Date(proposal.reviewPeriod.startDate).toLocaleDateString()} - ${new Date(proposal.reviewPeriod.endDate).toLocaleDateString()}`
      );

      if (proposal.voting.startDate) {
        console.log(
          `Voting Period: ${new Date(proposal.voting.startDate).toLocaleDateString()} - ${new Date(proposal.voting.endDate!).toLocaleDateString()}`
        );
        console.log(`Votes Cast: ${proposal.voting.votes.length}/${proposal.voting.quorum} (quorum)`);
      }
    }

    if (proposal.comments.length > 0) {
      console.log('');
      console.log(`Comments: ${proposal.comments.length}`);
      proposal.comments.slice(0, 3).forEach(comment => {
        console.log(`  ${comment.type}: ${comment.content.substring(0, 100)}...`);
      });
    }
  }
}

interface VoterProfile {
  weight: number;
  role: string;
}

// CLI usage
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const engine = new DemocraticAmendmentEngine();

  switch (command) {
    case 'status':
      const status = await engine.getDemocraticStatus();
      console.log('🗳️ Democratic Amendment System Status');
      console.log('===================================');
      console.log(`Active Proposals: ${status.activeProposals}`);
      console.log(`Pending Votes: ${status.pendingVotes}`);
      console.log(`System Health: ${status.systemHealth}`);
      if (status.recentActivity.length > 0) {
        console.log('\nRecent Activity:');
        status.recentActivity.forEach(activity => console.log(`  ${activity}`));
      }
      break;

    case 'list':
      const proposals = await engine.listProposals(args[1]);
      console.log(`\n📋 Amendment Proposals (${proposals.length})`);
      proposals.forEach(p => {
        console.log(`  ${p.id}: ${p.title} [${p.status}]`);
      });
      break;

    case 'show':
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
      break;

    default:
      console.log('🗳️ Democratic Amendment Workflow Engine');
      console.log('Available commands:');
      console.log('  status - Show system status');
      console.log('  list [status] - List proposals');
      console.log('  show <id> - Show proposal details');
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { DemocraticAmendmentEngine };
