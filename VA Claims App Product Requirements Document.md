# Product Requirements Document: VA Claims App

## 1. Overview

### Project Description

The VA Claims App is a web application designed to empower U.S. military veterans from all branches (Army, Navy, Air Force, Marine Corps, Coast Guard, Space Force) to manage their VA disability claims and appeals efficiently. Built with Next.js 15, TypeScript, and Tailwind CSS v4, the app leverages an existing UI/UX featuring a user dashboard with an AI-driven chat interface as the central focus. Key features include:

- **AI Chat Interface**: Integrates with the VA.gov API for real-time claim status, uses xAI Grok as the default LLM with OpenAI ChatGPT as a fallback, and provides guidance on claims, appeals, C&P exams, narrative creation, legal research, case law, and evidence support.
- **OCR for Document Uploads**: Supports Optical Character Recognition (OCR) for uploaded documents/images (PDF, JPG, PNG up to 20MB) with a file manager, using local processing initially and planning integration with Amazon Textract later.
- **Community Forum**: An SEO-optimized forum adapted from Next.js Discussion Platform, enabling veterans to share experiences with image/document uploads (up to 20MB), moderation, and thread previews for non-logged-in users to encourage sign-ups.
- **Resource Center**: A searchable library of guides, videos, CFR summaries, and state-specific benefits (e.g., MyArmyBenefits), accessible via chat or a dedicated page.
- **Admin Panel (BDOC)**: A Role-Based Access Control (RBAC) dashboard at /bdoc for managing users, system prompts, forum moderation, fine-tuning controls, and analytics.

The app integrates external APIs (e.g., eCFR, Federal Register) to enhance functionality and aims to surpass competitors like VetClaims.ai with a veteran-centric, comprehensive solution.

### Purpose of the Document

This PRD defines the app’s scope, requirements, and implementation details to guide the development team, ensuring alignment on features and performance expectations, optimized for Anthropic Claude 3.7.

---

## 2. Goals and Objectives

### Primary Goals

- Streamline veterans’ disability claims and appeals with real-time data, OCR, interactive forms, and AI-driven chat guidance.
- Ensure secure access via Clerk with ID.me, Login.gov, email, Apple, and Google SSO, bypassing auth in local development mode.
- Foster community engagement through an SEO-optimized forum with image/document uploads and moderation.
- Enhance AI responses via fine-tuning with uploaded documents and admin-controlled system prompts at /bdoc.
- Integrate veteran-specific and state-specific benefits with external services (e.g., eCFR, MyArmyBenefits).

### Success Metrics

- Achieve 95% uptime for VA.gov and eCFR API integrations.
- Reduce claim status query time to under 5 seconds.
- Attain 90% user satisfaction for chat interface usability (post-launch surveys).
- Process 100% of uploaded documents via OCR with 98% accuracy.
- Grow forum sign-ups by 15% month-over-month via preview mode.

---

## 3. Scope

### In-Scope

- AI chat interface with VA.gov API, xAI Grok, and OpenAI ChatGPT fallback.
- OCR for document uploads (local initially, Amazon Textract later) with file manager.
- SEO-optimized community forum with moderation and previews for non-logged-in users.
- RBAC admin panel (BDOC) at /bdoc for user management, prompts, and fine-tuning.
- Secure authentication via Clerk with SSO options and local bypass.
- Resource center with veteran and state-specific benefits.
- External API integrations (e.g., eCFR, Federal Register, My HealtheVet, VA Health, VSOs).

### Out-of-Scope

- Direct integration with non-VA healthcare systems.

---

## 4. Functional Requirements

### Chat Interface

- Provide real-time claim status via VA.gov API.
- Offer AI-driven guidance for claims, appeals, C&P exam prep, narrative creation, legal research, case law, and evidence support.
- Integrate eCFR API for regulatory research and CFR references.
- Support image/PDF uploads (max 20MB) with OCR for fine-tuning and explanations.
- Handle queries on claims, resources, uploads, and external APIs (e.g., Federal Register, My HealtheVet, VA Health, VSOs).
- Use Vercel AI SDK with xAI Grok (default) and OpenAI ChatGPT (fallback).

### OCR and File Management

- Enable document/image uploads (PDF, JPG, PNG up to 20MB) for OCR processing.
- Support local OCR initially, with Amazon Textract integration planned.
- Include a file manager for organizing and accessing processed files.
- Use OCR outputs for fine-tuning AI responses and claim evidence.

### Community Forum

- Allow thread creation with text, images, and documents (up to 20MB).
- Implement SEO optimization with meta tags and server-side rendering.
- Provide moderation tools via BDOC and previews for non-logged-in users.
- Support editing posts within 60 minutes and notifications for replies/mentions.

### Authentication

- Integrate Clerk for SSO with ID.me (ID.me Developers), Login.gov (Login.gov Developers), email, Apple, and Google OAuth.
- Implement OAuth 2.0 for VA.gov API, storing tokens in Supabase Postgres (production only).
- Bypass authentication in local development mode with mock sessions and a “Development Mode” badge.

### Admin Panel (BDOC)

- Hosted at /bdoc with RBAC for admins and moderators.
- Provide tools for user management, system prompt configuration, forum moderation, fine-tuning controls, and analytics.
- Log all admin actions in Supabase Postgres for auditing.
- Allow promotion of users to moderator roles.

### Resource Center

- Offer a searchable library of guides, videos, CFR summaries, and state-specific benefits (e.g., MyArmyBenefits).
- Integrate with eCFR and Benefits Reference Data APIs.
- Provide personalized recommendations via chat and downloadable PDFs.

### Claim and Appeal Management

- Enable viewing, submitting, and tracking claims/appeals via chat.
- Use a structured wizard for submissions (e.g., VA Form 21-526EZ) with auto-fill and error checking.
- Integrate Appeals and Decision Reviews APIs.

### AI Suggestions

- Analyze OCR-uploaded documents, referencing 38 CFR for claim suggestions.
- Deliver regulatory-backed suggestions via chat (e.g., “Your back pain may qualify under 38 CFR § 4.71a”).

### Reminders and Notifications

- Send push/email notifications for claim updates, deadlines, and forum activity using the existing UI notification area.
- Allow customization of notification preferences.

### User Dashboard

- Enhance existing UI/UX at /dashboard with a welcome message: “Welcome, {name}. We are glad you are here.” (Fallback: “beautiful” if name unavailable).
- Add tooltips for user guidance where applicable.

---

## 5. Non-Functional Requirements

### Performance

- Ensure chat responses under 2 seconds for 95% of queries.
- Support 10,000 concurrent users.
- Process OCR for a 10-page document in under 30 seconds.

### Security

- Encrypt data at rest and in transit (AES-256, TLS 1.3).
- Comply with VA.gov API security (OAuth 2.0).
- Use Clerk for secure session management and NextAuth.js for additional auth support.

### Scalability

- Scale to 50,000 monthly active users.
- Handle VA.gov API rate limits (1,000 requests/hour).

### Usability

- Retain existing Next.js 15 and Tailwind CSS v4 UI/UX.
- Ensure WCAG 2.1 AA accessibility compliance.
- Support screen readers for chat and forum.

### Development Environment

- Provide local setup with mocked APIs, mock sessions, and bypassed auth,
- Display “Development Mode” badge in the bottom-right corner locally.

---

## 6. User Stories and Acceptance Criteria

### Veteran User Stories

- **US-001: Secure Authentication**\
  *As a* veteran, *I want to* log in securely via Clerk, *so that* I can access app features.\
  *Acceptance Criteria:*

  - Login via Clerk,  ID.me, Login.gov, email, Apple, or Google SSO.
  - Local mode bypasses auth with mock sessions and badge.
  - Successful login redirects to /dashboard.

- **US-002: Real-time Claim Status**\
  *As a* veteran, *I want to* check claim status via chat, *so that* I stay informed.\
  *Acceptance Criteria:*

  - Chat queries VA.gov API with updates in under 5 seconds.
  - Displays claim ID, stage, and timeline.

- **US-003: AI-driven Guidance**\
  *As a* veteran, *I want to* get AI guidance via chat, *so that* I can strengthen my claim.\
  *Acceptance Criteria:*

  - Guidance includes narrative creation, legal research, case law, and C&P prep.
  - Uses Grok (default) or ChatGPT (fallback).
  - Cites eCFR with clickable links.

- **US-004: OCR Document Upload**\
  *As a* veteran, *I want to* upload documents for OCR, *so that* I can use them as evidence.\
  *Acceptance Criteria:*

  - Uploads PDF/JPG/PNG (max 20MB) with 98% OCR accuracy.
  - Files are accessible in file manager and used for fine-tuning.

- **US-005: Forum Participation**\
  *As a* veteran, *I want to* post in the forum, *so that* I can connect with others.\
  *Acceptance Criteria:*

  - Create threads with text/images/documents (max 20MB).
  - Non-logged-in users see previews only.
  - Notifications for replies.

- **US-006: Claim Submission**\
  *As a* veteran, *I want to* submit claims via chat, *so that* I can file easily.\
  *Acceptance Criteria:*

  - Structured wizard auto-fills VA Form 21-526EZ with error checking.
  - Submission completes with confirmation.

- **US-007: Research Access**\
  *As a* veteran, *I want to* access guides and benefits via chat, *so that* I can learn more.\
  *Acceptance Criteria:*

  - Chat provides CFR summaries and state-specific benefits.
  - Resources are downloadable as PDFs.

- **US-008: Notifications**\
  *As a* veteran, *I want to* receive reminders, *so that* I don’t miss deadlines.\
  *Acceptance Criteria:*

  - Push/email alerts for claim updates and forum activity.
  - Customizable preferences saved.

### Admin User Stories

- **US-009: Configure System Prompts**\
  *As an* admin, *I want to* configure chat prompts, *so that* I can tailor AI responses in the chat interface. \
  *Acceptance Criteria:*

  - Edit prompts via /bdoc with preview.
  - Updates apply within 1 minute.

- **US-010: Manage Users**\
  *As an* admin, *I want to* manage user accounts, *so that* I can control access.\
  *Acceptance Criteria:*

  - Add/remove users and promote moderators via /bdoc.
  - Actions are logged in Supabase Postgres in production. mock data in development.

- **US-011: Monitor Analytics**\
  *As an* admin, *I want to* track engagement, *so that* I can improve services.\
  *Acceptance Criteria:*

  - View reports on user activity, forum posts, and OCR accuracy via /bdoc.
  - Data updates in real-time.

### Developer User Stories

- **US-012: Local Development**\
  *As a* developer, *I want to* work locally with bypassed auth, *so that* I can test features.\
  *Acceptance Criteria:*

  - Local mode uses mocked APIs, mock sessions, and displays badge.
  - Dashboard uses demo data from `data/dummyData.ts`.

- **US-013: Preserve UI/UX**\
  *As a* developer, *I want to* add features without breaking UI/UX, *so that* the app remains consistent.\
  *Acceptance Criteria:*

  - New components match Tailwind CSS v4 styles.
  - No regressions in existing dashboard functionality.

### Moderator User Stories

- **US-014: Moderate Forum**\
  *As a* moderator, *I want to* manage forum posts, *so that* I can maintain community quality.\
  *Acceptance Criteria:*

  - Edit/delete posts via /bdoc moderation tools.
  - Actions are logged and visible to admins.

- **US-015: Promote Engagement**\
  *As a* moderator, *I want to* highlight valuable threads, *so that* veterans benefit from discussions.\
  *Acceptance Criteria:*

  - Pin threads via /bdoc with visibility controls.
  - Pinned threads appear at the top for logged-in users.

---

## 7. Task Breakdown

- **Sprint 1: Authentication and Dashboard Enhancements** (2 weeks)

  - Implement Clerk SSO and local bypass (US-001, US-012).
  - Add welcome message and tooltips to /dashboard (US-012, US-013).

- **Sprint 2: Chat Interface and APIs** (3 weeks)

  - Integrate VA.gov and eCFR APIs with chat (US-002, US-003).
  - Add narrative creation, legal research, case law, and C&P prep (US-003).

- **Sprint 3: OCR and File Management** (2 weeks)

  - Implement local OCR and file manager (US-004).
  - Enable fine-tuning with uploads (US-003).

- **Sprint 4: Community Forum** (3 weeks)

  - Build SEO-optimized forum with previews and moderation (US-005, US-014).
  - Add image/document upload support (US-005).

- **Sprint 5: Admin Panel and Resource Center** (2 weeks)

  - Enhance /bdoc with prompt, user management, and analytics (US-009, US-010, US-011).
  - Build resource center with API integration (US-007).

---

## 8. Dependencies

### External Dependencies

- VA.gov API (OAuth 2.0).
- eCFR API for research.
- Amazon Textract (future OCR).
- Clerk for SSO.
- xAI Grok and OpenAI ChatGPT for LLM.
- Supabase Postgres (production tokens).

### Internal Dependencies

- Existing Next.js 15, TypeScript, and Tailwind CSS v4 UI/UX.
- User dashboard and BDOC admin panel.

---

## 9. Risks and Mitigations

- **Risk 1: API Downtime**\
  *Mitigation:* Cache recent API data and use fallback responses.
- **Risk 2: OCR Inaccuracy**\
  *Mitigation:* Test with diverse documents; plan Textract integration.
- **Risk 3: UI/UX Breakage**\
  *Mitigation:* Use existing dashboard, confirm changes before implementation.

---

## 10. Timeline

- **Total Duration:** 12 weeks (3 months)
  - Sprint 1: 2 weeks
  - Sprint 2: 3 weeks
  - Sprint 3: 2 weeks
  - Sprint 4: 3 weeks
  - Sprint 5: 2 weeks

---

## 11. Assumptions

- VA.gov and eCFR APIs remain stable.
- Existing UI/UX requires no major refactoring.
- Development team is proficient in Next.js and TypeScript.

---

## 12. Glossary

- **VA**: Veterans Affairs.
- **OCR**: Optical Character Recognition.
- **RBAC**: Role-Based Access Control.
- **SSO**: Single Sign-On.
- **eCFR**: Electronic Code of Federal Regulations.
- **BDOC**: Backend Dashboard Operations Center.
- **LLM**: Large Language Model.

---

## 13. Appendix

### Key Citations

- VA.gov API
- eCFR API
- Federal Register API
- My HealtheVet API
- Vercel AI SDK
- Amazon Textract
- OpenAI Fine-Tuning
- Next.js Discussion Platform
- ID.me Developers
- NextAuth.js
- Stripe
- Prisma
- VA.gov Content Style Guide
- MyArmyBenefits
- Military.com
- v0.dev
- Tailwind CSS v4
- Clerk Quickstart for Next.js
- Login.gov Developers
- Stripe Documentation
- Recoil
- Chakra UI for Next.js

---

## 14. Additional PRD Features

- **Templates**: Claim/appeal letter templates.\
  *Copy:* “Use strong templates to support your claim.”
- **Mental Health Resources**: Links to VA mental health support.\
  *Copy:* “Explore mental health resources tailored for veterans.”
- **Optimization**: Caching for forum, OCR, and admin controls to enhance performance.
- **Feedback Mechanism**: Collect user feedback on copy, OCR accuracy, AI responses, forum usability, and landing page experience.
- **Regulatory Updates**: Integrate Federal Register updates via chat for real-time regulatory information.

---

## 15. Copy Guidelines for U.S. Veterans

- **Tone**: Conversational, empathetic, supportive, and patriotic, following the VA.gov Content Style Guide.
- **Inclusivity**: Use acceptable military jargon and include all branches (e.g., “military service”).
- **Language**: Person-first language (e.g., “veterans with disabilities”).
- **Clarity**: Use plain language and define acronyms (e.g., VBMS).
- **Action-Oriented**: Provide clear instructions (e.g., “Start your claim”).
- **Empathy**: Acknowledge service (e.g., “You served, we help”).
- **SEO**: Include keywords like “VA claims,” “disability benefits,” “veteran support.”

---

## 16. Breakdown and Implementation Details

### Authentication Implementation

- **Task**: Implement secure SSO with Clerk and local bypass.
- **Details**:
  - Use OIDC for ID.me and Login.gov, OAuth for email, Apple, and Google via Clerk.
  - Store VA API tokens in Supabase Postgres (production) and use mock sessions locally in `auth.mock.ts`.
  - Ensure SSO enables seamless access across app, forum, and landing page.
- **Dependencies**: Clerk, Supabase Postgres (production), Prisma Schema (local).
- **Success Criteria**:
  - 100% successful sign-ins with SSO.
  - Local bypass works with mock sessions and displays “Development Mode” badge.

### User Dashboard Implementation

- **Task**: Enhance the existing dashboard with a welcome message and tooltips.
- **Details**:
  - Add welcome message: “Welcome, {name}. We are glad you are here.” (Fallback: “beautiful”).
  - Implement tooltips for user guidance where applicable.
- **Dependencies**: Existing UI/UX, Clerk for user data.
- **Success Criteria**:
  - Welcome message displays correctly with user’s name or fallback.
  - Tooltips are functional and helpful.

### Chat Interface Implementation

- **Task**: Develop AI-powered chat with integrations for claims, research, OCR, and external APIs.
- **Details**:
  - Use Vercel AI SDK with xAI Grok (default) and OpenAI ChatGPT (fallback).
  - Integrate VA.gov API for claim status and eCFR API for legal research.
  - Support image/PDF uploads (max 20MB) with OCR for fine-tuning and explanations.
- **Dependencies**: Vercel AI SDK, xAI Grok, OpenAI ChatGPT, VA.gov API, eCFR API, OCR processing.
- **Success Criteria**:
  - Chat responds in under 2 seconds for 95% of requests.
  - Provides accurate, cited information from external APIs.

### OCR and File Management Implementation

- **Task**: Implement local OCR processing for document uploads with a file manager.
- **Details**:
  - Support PDF, JPG, and PNG uploads up to 20MB.
  - Use local OCR processing initially, with Amazon Textract integration planned.
  - Include a file manager for organizing and accessing processed files.
- **Dependencies**: Local OCR library, file storage solution.
- **Success Criteria**:
  - OCR processes documents with 98% accuracy.
  - File manager allows easy access and organization.

### Community Forum Implementation

- **Task**: Build an SEO-optimized forum with moderation and previews.
- **Details**:
  - Adapt from Next.js Discussion Platform with Clerk auth.
  - Allow thread creation with text, images, and documents (max 20MB).
  - Implement SEO with meta tags and server-side rendering; provide previews for non-logged-in users.
- **Dependencies**: Clerk, Supabase Postgres (production), Prisma Schema (local).
- **Success Criteria**:
  - Forum posts are SEO-optimized and indexed.
  - Non-logged-in users see previews and are prompted to sign up.

### Admin Panel (BDOC) Implementation

- **Task**: Enhance /bdoc with RBAC, user management, prompts, and analytics.
- **Details**:
  - Implement RBAC for admin and moderator roles.
  - Provide tools for user management, system prompts, forum moderation, and analytics.
- **Dependencies**: Clerk, Supabase Postgres (production).
- **Success Criteria**:
  - Only authorized users access admin features.
  - Prompts and analytics update within 1 minute.

### Resource Center Implementation

- **Task**: Develop a searchable library of guides, videos, and benefits.
- **Details**:
  - Integrate with eCFR and Benefits Reference Data APIs.
  - Provide personalized recommendations via chat and downloadable PDFs.
- **Dependencies**: eCFR API, Benefits Reference Data API, Chat Interface.
- **Success Criteria**:
  - Resources are accurately retrieved and displayed.
  - Recommendations are relevant and helpful.

---

This PRD provides a detailed specification for the VA Claims App, ensuring all features are clearly defined and aligned with project goals. It is structured for efficient development and implementation, maintaining clarity for the team.