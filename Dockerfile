# ========================================
# Base stage - shared configuration
# ========================================
FROM node:24-slim AS base

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Set working directory
WORKDIR /app

# Note: npm is pre-installed in the node image, so corepack is not needed here.

# ========================================
# Dependencies stage - install all deps
# ========================================
FROM base AS deps

# Copy package files for dependency installation
# Using package-lock.json for npm reproducibility
COPY package.json package-lock.json ./

# Install dependencies using clean install (ci) for production-ready builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ========================================
# Builder stage - build the application
# ========================================
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application using npm script
RUN npm run build

# ========================================
# Runner stage - production image
# ========================================
FROM node:24-slim AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security purposes
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set correct permissions for Next.js cache
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone build output
# Next.js standalone mode works independently of the package manager used during build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose default Next.js port
EXPOSE 3000

# Set network binding environment variables
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Health check using wget (available in slim images)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application using the standalone server
CMD ["node", "server.js"]
