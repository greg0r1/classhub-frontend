You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## ClassHub Project Specific Guidelines

### Architecture

- Follow Clean Architecture principles with clear separation of concerns
- Organize code in layers: core/, shared/, features/, layout/
- Use the generated API client from `src/app/api/generated/` for all backend calls
- Never manually create API service calls; regenerate the client instead (`npm run generate-api`)

### API Integration

- All API calls must use the generated TypeScript client from Swagger
- The API client is automatically typed and synchronized with the backend
- JWT tokens are automatically added via `authInterceptor`
- Use the `AuthService` for authentication state management

### State Management

- Use signals for local component state
- Use services with BehaviorSubjects for shared state across components
- The `AuthService` exposes `currentUser$` observable for authentication state
- Avoid using external state management libraries (NgRx, Akita) unless absolutely necessary

### Forms

- Always use Reactive Forms with strong typing
- Create separate DTO interfaces matching the backend DTOs
- Use `class-validator` decorators in DTOs for validation
- Display validation errors in user-friendly French messages

### Routing & Guards

- All protected routes must use `AuthGuard`
- Admin-only routes must use `RoleGuard(['admin'])`
- Coach routes must use `RoleGuard(['admin', 'coach'])`
- Implement lazy loading for all feature modules

### UI/UX

- Use Angular Material components consistently
- Follow the established design system (colors, spacing, typography)
- All forms must have loading states and error handling
- Display success/error messages using Material Snackbar
- Ensure responsive design for mobile, tablet, and desktop

### Multi-tenant Context

- Never manually filter by organization_id in the frontend
- The backend automatically filters data by organization
- Organization context comes from the JWT token
- Trust the backend isolation; don't implement additional checks

### Performance

- Use `ChangeDetectionStrategy.OnPush` on all components
- Implement `trackBy` functions in all `@for` loops
- Lazy load images with `NgOptimizedImage`
- Unsubscribe from observables (use `takeUntilDestroyed()` signal)

### Error Handling

- Catch HTTP errors in the `errorInterceptor`
- Display user-friendly error messages in French
- Log errors to console in development, to monitoring service in production
- Handle 401 errors by redirecting to login
- Handle 403 errors by showing permission denied message

### Testing

- Write unit tests for all services
- Write component tests for critical user journeys
- Mock the API client in tests
- Aim for 80%+ code coverage

### Code Style

- Use French for user-facing text (labels, messages, etc.)
- Use English for code (variables, functions, classes)
- Follow existing naming conventions in the codebase
- Add JSDoc comments for complex functions
- Keep functions under 20 lines when possible

### Security

- Never store sensitive data in localStorage except JWT token
- Always validate user input on frontend AND backend
- Sanitize user-generated content before display
- Never bypass Angular's built-in XSS protection

### Git Workflow

- Commit small, focused changes with clear messages
- Use conventional commit format: `feat:`, `fix:`, `refactor:`, etc.
- Create feature branches for new functionality
- Never commit `.env` files or secrets
