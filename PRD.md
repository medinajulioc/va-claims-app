# VA Claims App PRD

## Overview

The VA Claims App empowers U.S. military veterans from all branches (Army, Navy, Air Force, Marine Corps, Coast Guard, Space Force) to manage VA disability claims and appeals efficiently. Integrated with the VA.gov API, it provides real-time claim status updates, AI-driven guidance via a v0.dev-inspired chat interface, a community forum, a resource center, and a landing page. Built with Next.js, TypeScript, and Tailwind CSS v4, the app features a military-inspired aesthetic (tan, green, brown, and black) and a user-friendly dashboard using Shadcn UI. It includes an RBAC admin panel for app management and leverages Optical Character Recognition (OCR) via Amazon Textract and external APIs (e.g., eCFR) to enhance functionality. The app aims to surpass competitors like VetClaims.ai by offering comprehensive, veteran-centric features.

### Objectives

- Streamline veterans’ disability claims and appeals with real-time data, OCR, forms, and AI chat, integrating xAI Grok and OpenAI ChatGPT as a fallback with fine-tuned models.
- Deliver a v0.dev-inspired landing page with a chat widget focus and a member dashboard with a complete chat interface.
- Ensure secure access via NextAuth.js with ID.me, Login.gov, email, Apple, and Google SSO, bypassed locally in development mode.
- Foster engagement through an SEO-optimized forum with image and document uploads.
- Enhance AI responses and personalization via fine-tuning and admin panel-controlled system prompts.
- Provide secure admin tools with Role-Based Access Control (RBAC) and change logging.
- Support a local development environment with a distinct "Development Mode" badge.
- Integrate veteran-specific and state-specific benefits and external services.

### Supporting Evidence

- Every claim needs proof. The app provides research-backed medical journals to strengthen claims and ensure the VA acknowledges the facts.

### Narrative Creation

- The app helps veterans craft compelling narratives connecting evidence, legal backing, and service history in VA-friendly language.

### Legal Research Backing

- Built on a deep understanding of VA rules and regulations, ensuring claims are legally sound.

### Preparation

- Prepares veterans for C&P exams with guidance to approach them confidently, as this is a critical moment in the claims process.

### Case Law

- Leverages decades of legal precedents to hold the VA accountable to prior rulings.

### Support

- Offers a veteran-centric AI expert to answer questions, reduce confusion, and guide users throughout the process.

## Core Features

### Authentication

- **Description**: Secure login with NextAuth.js, supporting ID.me, Login.gov, email, Apple, and Google SSO for forum, landing page, and services.
- **Details**: Uses OIDC for ID.me/Login.gov and OAuth for email/Apple/Google. SSO enables seamless access. Bypassed in Development Mode with mock sessions.
- **Purpose**: Ensures secure production access and efficient development.
- **Copy**: "Sign in safely with ID.me, Login.gov, or email."

### User Dashboard

- **Description**: A centralized, chat-centric area for managing claims, appeals, forum interactions, notifications, forms, and benefits.
- **Details**: Features a v0.dev-inspired UI with a collapsible sidebar, card displays for statuses, and tooltips for ease of use.
- **Purpose**: Simplifies navigation and task access.
- **Copy**: "Welcome, veteran! Manage your claims and explore benefits."

### Chat Interface

- **Description**: AI-powered assistant integrating claims, research, OCR, fine-tuned AI, and external APIs, inspired by v0.dev UI.
- **Details**: Built with Vercel AI SDK using Grok (xAI) with OpenAI fallback. Split-screen design shows chat on the left and dynamic content on the right. Supports image/PDF uploads (max 20 MB) with OCR.
- **Purpose**: Centralizes app functionality via natural language interaction.
- **Copy**: "Ask about claims, regulations, or benefits in our chat."

### Claim and Appeal Management

- **Description**: Tools for viewing, submitting, and tracking claims/appeals, accessible via chat.
- **Details**: Integrates VA.gov APIs for real-time data, includes a structured wizard, and supports OCR document uploads with auto-filled forms (e.g., VA Form 21-526EZ).
- **Purpose**: Automates claim/appeal tasks with chat integration.
- **Copy**: "File your claim easily with our guided wizard."

### Research and Educational Tools

- **Description**: Resource library with guides, videos, CFR summaries, and benefits, accessible via chat.
- **Details**: Uses Benefits Reference Data and eCFR APIs, curates content from MyArmyBenefits and Military.com, and offers personalized recommendations.
- **Purpose**: Empowers veterans with knowledge.
- **Copy**: "Strengthen your claim with tailored guides."

### AI Suggestions

- **Description**: Suggests claims based on OCR data and CFR, delivered via chat.
- **Details**: This function analyzes disabilities from uploads, referencing 38 CFR (e.g., § 4.71a), with fine-tuned model suggestions.
- **Purpose**: Increases claim success with regulatory-backed insights.
- **Copy**: "Your back pain may qualify under 38 CFR § 4.71a."

### Reminders and Notifications

- **Description**: Alerts for claim, appeal, and benefit tasks.
- **Details**: Sends customizable push/email notifications for updates and deadlines.
- **Purpose**: Keeps veterans proactive.
- **Copy**: "Don’t miss your deadline! Submit evidence by [date]."

### Community Forum

- **Description**: SEO-optimized forum for information exchange and support.
- **Details**: Adapted from Next.js Discussion Platform, uses unified NextAuth.js SSO, supports posts, comments, voting, and uploads (max 20 MB). Moderation via RBAC.
- **Purpose**: Fosters peer support and membership value.
- **Copy**: "Share advice and engage with veterans after signing in."

### Admin Control Panel

- **Description**: Secure interface with RBAC for managing app, forum, AI, payments, and logs.
- **Details**: Includes user management, AI settings, OCR configuration, forum moderation, usage monitoring, Stripe dashboard, and system prompts. Built with Shadcn UI and Tailwind CSS v4.
- **Purpose**: Ensures secure, scalable management.
- **Copy**: "Manage the app securely with admin-only access."

### Payment System

- **Description**: Manages subscription access via Stripe API.
- **Details**: Offers free (limited) and premium (full access) tiers, with dummy data in development mode.
- **Purpose**: Supports sustainable development.
- **Copy**: "Choose a plan to unlock tools and forum access."

### Analytics and Reporting

- **Description**: Tracks engagement and performance, including forum, landing page, and subscriptions.
- **Details**: Metrics include user activity, claims, forum views, and OCR/AI accuracy, integrated with Google Analytics and Stripe API.
- **Purpose**: Drives data-informed enhancements.
- **Copy**: "Monitor veteran engagement to improve services."

### OCR and Document Processing

- **Description**: Extracts text/data from chat/forum uploads using Amazon Textract.
- **Details**: Supports PDFs/images (max 20 MB), extracts text and form fields, with a feedback loop for accuracy.
- **Purpose**: Automates document processing.
- **Copy**: "Upload your forms and letters, and we’ll extract details."

### Machine Learning and Fine-Tuning

- **Description**: Enhances AI, OCR, and personalization, accessible via chat.
- **Details**: Fine-tunes OpenAI models with chat logs and CFR data, trains Textract adapters, and personalizes recommendations.
- **Purpose**: Improves response accuracy and personalization.
- **Copy**: "Our AI learns to assist you better."

### External API Integrations

- **Description**: Connects to APIs for data, accessible via chat.
- **Details**: Includes eCFR, Federal Register, My HealtheVet, VA Health, VSOs, Google Cloud Vision, and Google Analytics/Mixpanel.
- **Purpose**: Enriches app with regulatory, health, and community data.
- **Copy**: "Access all your benefits in one place."

### Interactive VA Forms

- **Description**: Auto-filled forms for claims/appeals, accessible via chat.
- **Details**: Pre-fills forms with OCR data or profiles, submits via Benefits Intake API.
- **Purpose**: Simplifies paperwork and reduces errors.
- **Copy**: "Complete VA forms easily."

### Notification System

- **Description**: Alerts for claim/benefit tasks.
- **Details**: Delivers customizable push/email notifications.
- **Purpose**: Ensures proactive engagement.
- **Copy**: "Stay on top of your claim."

### Accessibility Enhancements

- **Description**: Supports accessibility for veterans with disabilities.
- **Details**: Follows WCAG 2.1 with features like voice navigation and screen readers.
- **Purpose**: Enhances usability for all veterans.

### State-Specific Benefits Aggregation

- **Description**: Curates state benefits, accessible via chat.
- **Details**: Aggregates data from MyArmyBenefits, Military.com, and state VA sites.
- **Purpose**: Provides comprehensive benefit access.
- **Copy**: "Discover your state’s benefits."

### Landing Page

- **Description**: v0.dev-inspired entry point with a chat widget hero section.
- **Details**: Features a limited chat widget for non-signed-in users, military-styled design, and Development Mode badge with auth bypass for local testing.
- **Purpose**: Engages users and drives sign-ups.
- **Copy**: "Start your VA claims journey—sign up for full access!"

## User Experience

### Target Audience

- **Veterans**: U.S. military veterans from all branches managing claims, appeals, and benefits, researching disabilities, C&P exams, and secondary conditions.

### User Journey

- **Login**: Securely sign in with ID.me, Login.gov, email, Apple, or Google.
- **Dashboard**: Access claims, forum, notifications, forms, and benefits via a chat-centric interface.
- **Chat Interaction**: Use the AI chat to manage claims, upload documents, access resources, and receive suggestions.
- **Forum Participation**: Engage in the community forum with posts and uploads after signing in.
- **Landing Page**: Explore features and sign up via the chat widget.

### UI/UX Considerations

- **Design**: Military-inspired aesthetic (tan, green, brown, black), v0.dev-inspired chat split screen, Shadcn UI components, responsive across devices. **Tailwind CSS v4 is used exclusively throughout the app, including the admin panel, forum, and landing page, ensuring a unified and polished design. No other versions of Tailwind CSS are permitted, and the latest syntax and plugins (e.g., typography, forms) are utilized to maintain a sharp, consistent look and feel across all UI/UX elements.**
- **Accessibility**: WCAG 2.1 compliance with voice navigation and screen readers.
- **Copy**: Follows VA.gov Content Style Guide—empathetic, conversational, and veteran-centric.

## Technical Architecture

### Frontend

- **Framework**: Next.js, TypeScript. **Strict TypeScript usage is enforced across all components to ensure type safety, prevent runtime errors, and maintain high code quality.**
- **Styling**: Tailwind CSS v4 with military colors, applied consistently using the latest syntax and plugins.
- **UI**: Shadcn UI for app, forum, landing page, and admin panel.
- **SEO**: Server-side rendering for forum and landing page.

### Backend

- **API Routes**: Next.js routes for database interactions, configured to use Prisma schema in development mode and Supabase Postgres in production.
- **Database**:
  - **Development**: Prisma schema is used exclusively in development mode, running locally to facilitate rapid iteration and testing.
  - **Production**: Supabase Postgres is used exclusively in the production environment, hosted on Vercel, for logs, forums, and analytics.
  - **Important**: Environments are strictly separated with no crossover; development mode relies solely on Prisma schema locally, while production relies solely on Supabase Postgres on Vercel hosting. This ensures consistency and prevents environment-specific issues.
- **VA APIs**: Claims, Intake, Reference Data, Appeals, Decision Reviews, Forms, My HealtheVet, VA Health.
- **External APIs**: eCFR, Federal Register, VSOs, Google Cloud Vision, Google Analytics/Mixpanel.

### AI Integration

- **SDK**: Vercel AI SDK.
- **Models**: Grok (xAI), OpenAI fine-tuned via admin panel prompts.
- **Features**: Chat, suggestions, topic modeling, and personalization.

### Authentication

- **NextAuth.js**: OIDC (ID.me/Login.gov), OAuth (email/Apple/Google), SSO for forum/landing page, local bypass in Development Mode.

### OCR

- **Amazon Textract**: Processes chat/forum uploads (max 20 MB).

### Payments

- **Provider**: Stripe, managed via Admin Panel with free/premium tiers.

### Development Mode

- **Details**: Local environment with "Development Mode" badge, Prisma schema for database interactions, and mock sessions, isolated from production.

### Hosting

- **Development**: Runs locally using Prisma schema for database management.
- **Production**: Deployed on Vercel hosting using Supabase Postgres for database management.

## Development Roadmap

### MVP Requirements

- Authentication, User Dashboard, Chat Interface, Claim and Appeal Management, Community Forum (basic), Admin Panel, Payment System, OCR, and essential API integrations.

### Future Enhancements

- Advanced AI features, expanded API integrations (e.g., My HealtheVet, VA Health), state-specific benefits aggregation, enhanced analytics, and accessibility improvements.

## Logical Dependency Chain

1. **Authentication**: Foundational for user access.
2. **User Dashboard**: Entry point requiring authentication.
3. **Chat Interface**: Core interaction hub dependent on the user dashboard.
4. **Claim and Appeal Management**: Relies on chat and authentication.
5. **Community Forum**: Parallel development with authentication integration.
6. **Admin Panel**: Built after core features for management.
7. **Payment System**: Depends on admin panel and authentication.
8. **OCR and AI Enhancements**: Added post-chat and dashboard functionality.
9. **Additional Features**: External APIs, accessibility, and state benefits built iteratively.

## Risks and Mitigations

- **API Changes**: Monitor updates and use flexible integration strategies.
- **AI Accuracy**: Fine-tune with veteran-specific data and expert validation.
- **OCR Accuracy**: Test diverse documents with user feedback loops.
- **Security**: Encrypt data, implement RBAC, and conduct audits.
- **Forum Abuse**: Use anti-spam measures and RBAC moderation.
- **Integration Complexity**: Manage dependencies and test thoroughly.
- **SEO and Adoption**: Optimize indexing, offer a free tier, and track engagement.

## Appendix

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