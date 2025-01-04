# Lightshot Random Screenshot Viewer

## Overview
A web application that fetches and displays random screenshots from Lightshot's database by generating random URLs and extracting the images.

## Core Features

### Implemented ✅
- [x] Random URL generation for Lightshot screenshots
- [x] Image URL extraction from Lightshot pages
- [x] Basic homepage with screenshot display
- [x] "Get Another Screenshot" functionality
- [x] Loading states and error handling
- [x] Responsive image display
- [x] Google Authentication integration
- [x] Image caption functionality
- [x] User profile system

### Planned 📋
- [ ] Save favorite screenshots
- [ ] Share screenshots functionality
- [ ] Rate limiting for API requests
- [ ] Image moderation/filtering
- [ ] User tiers system
- [ ] Leaderboard system
  - [ ] Points for daily activity
  - [ ] Points for quality captions
  - [ ] Weekly/Monthly rankings
  - [ ] Achievement badges
- [ ] Screenshot collection/gallery feature
- [ ] Report inappropriate content feature

## Technical Implementation

### Current Architecture
1. **Frontend**
   - Next.js for the framework
   - React components for UI
   - Tailwind CSS for styling
   - NextAuth.js for authentication

2. **Backend**
   - API Routes for handling requests
   - Image URL extraction utility
   - Error handling middleware
   - Google OAuth integration
   - Database integration for user data and captions

3. **External Services**
   - Lightshot (prnt.sc) for source images
   - Google OAuth for authentication

### Technical Challenges
1. Dealing with Lightshot's protection mechanisms
2. Handling invalid or deleted screenshots
3. Managing cross-origin resource sharing
4. Optimizing image loading performance

## Next Steps Priority List

### High Priority
1. Implement leaderboard system
2. Create user tiers system
3. Add rate limiting to prevent abuse
4. Implement proper error handling for failed image loads

### Medium Priority
1. Add screenshot saving functionality
2. Implement sharing features
3. Create user dashboard
4. Add image moderation
5. Add achievement system
6. Implement point calculation logic

### Low Priority
1. Add analytics
2. Implement advanced filtering
3. Add social features
4. Create API documentation

## Notes
- Need to handle CORS properly
- Consider implementing caching for frequently accessed images
- Monitor API usage and implement rate limiting
- Consider adding image preprocessing for optimization

## Development Guidelines
1. All new features should include error handling
2. Maintain responsive design
3. Keep accessibility in mind
4. Write tests for critical functionality

## Known Issues
1. Some Lightshot URLs may return invalid images
2. Potential rate limiting from Lightshot
3. Cross-origin resource sharing restrictions

## Future Considerations
1. Scaling strategy
2. Content moderation system
3. Premium features for paid tiers
4. Mobile app version
5. Advanced leaderboard features
  - Seasonal competitions
  - Team/Guild system
  - Special events
6. Social features integration
  - Friend system
  - Social sharing
  - Collaborative captioning

## Leaderboard System Design
### Point System
1. Daily Activities
   - Logging in: 5 points
   - Adding captions: 10 points per caption
   - Getting caption likes: 2 points per like

2. Achievement Tiers
   - Bronze: 0-1000 points
   - Silver: 1001-5000 points
   - Gold: 5001-10000 points
   - Platinum: 10000+ points

3. Weekly/Monthly Rankings
   - Top 10 users displayed
   - Special badges for consistent top performers
   - Monthly rewards for top contributors 