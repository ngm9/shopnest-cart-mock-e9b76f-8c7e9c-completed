# ShopNest — Cart Spec Determinism

## Task Overview

ShopNest is an online retail platform whose checkout funnel is critical to business revenue. The QA team owns a Playwright spec that validates the 'Add to cart' flow for the Wireless Mouse product — one of the store's highest-selling items. Currently the spec fires a real HTTP request to `POST /api/cart/items` every time it runs; because the backend is shared across all CI pipelines, it occasionally buckles under load and returns `503 Service Unavailable`, causing the cart test to fail for reasons that have nothing to do with the UI. Product managers and developers have lost confidence in the test suite because failures no longer reliably indicate a UI defect. The spec must be made deterministic so that every run reflects UI behaviour alone, not backend availability.

## Objectives

- The happy-path test consistently passes on every run regardless of whether a real backend is reachable, and the cart badge and success toast confirm the product was added to the cart exactly once after the button is clicked.
- A second test covers the scenario where the server is unavailable: the UI surfaces a visible error message that communicates the failure to the user, verified by the test without any reliance on real backend state.
- Neither test depends on the other's side effects, shared mutable state, or execution order — each test starts from a clean slate.
- The spec contains no hard-coded delays or arbitrary sleeps anywhere in the test file.
- Running `npx playwright test` five consecutive times produces five green runs with no intermittent failures.

## Helpful Tips

- Consider what Playwright provides specifically for controlling how a page's outgoing network requests are handled before they ever reach a real server.
- Think about the difference between stubbing a response once for a single test versus leaving the route active globally — what are the isolation implications of each approach?
- Consider what information the stub response must return (status code, headers, body) to satisfy the UI's rendering logic for a successful add-to-cart.
- Think about what "self-contained" means for a test: if you ran only that one test in isolation with `--grep`, would it still pass?
- Explore how Playwright's built-in assertion API waits for the DOM to reach the expected state rather than requiring you to add an explicit pause.
- Consider whether setup that runs once before all tests or once before each individual test better guarantees that no state leaks between the happy-path and error-path scenarios.
- Review how the app communicates a backend error to the user — the test assertion must target what a real user would actually see on screen.

## How to Verify

- Run `npx playwright test` — both tests in `tests/cart.spec.ts` must pass.
- Run `npx playwright test` four more times in succession — all runs must be green with no flakes.
- Inspect the spec: confirm there is no `waitForTimeout`, `setTimeout`, or any numeric sleep anywhere in the file.
- Inspect the spec: confirm that no test relies on a variable, cookie, or DOM state set by the other test.
- Open `playwright-report/index.html` after a run and verify both test titles appear with a green status and that trace/screenshot artifacts are present for each.
- Confirm that neither test makes a real outbound call to `/api/cart/items` — the network tab in a headed run (`npx playwright test --headed`) should show the request intercepted, not fulfilled by a server.
- Check that the error-path test asserts on a message the user can read on screen, not on an internal variable or console output.