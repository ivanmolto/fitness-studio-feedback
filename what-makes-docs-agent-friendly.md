
# Agent-Friendly Docs

# What Makes Docs Agent-Friendly

Human readers scan headings, find an endpoint, and copy a curl command. When an example contains a small mistake or omits an error case, experience can help them fill the gap.

Agents rely more heavily on what the documentation states.

If the docs name a parameter `course_slug` while the API expects `courseSlug`, an agent may send the wrong name and receive a 400. An undocumented error leaves it without a recovery path. Placeholder values such as `"string"` can also end up in a request unchanged.

The documentation needs to remove that ambiguity.

## Outcome

Understand the seven patterns that make API documentation agent-friendly and recognize that you won't write these docs by hand.

## Fast Track

1. Learn the seven patterns that separate agent-friendly docs from human-only docs
2. See concrete before/after examples for each pattern
3. Understand why you'll automate doc generation instead of maintaining docs manually

## Endpoint signatures in code blocks

Use code blocks for endpoint signatures so the method and path are explicit:

```
GET /api/feedback
```

A prose-only version leaves more room for interpretation:

> Send a GET request to the feedback endpoint to retrieve all entries.

The code block gives an agent an exact method and path to extract.

Every endpoint in your docs should start with a code block containing the HTTP method and path. No extra words, no surrounding explanation inside the block. The code block is the source of truth.

## Parameters as tables

Markdown tables give parameter definitions a consistent structure. Mixed-format bullet lists are harder to parse reliably.

```markdown
| Parameter   | Type   | Required | Description           |
|-------------|--------|----------|-----------------------|
| courseSlug  | string | no       | Filter by course slug |
```

Compare that to:

> - `courseSlug` (optional) - a string that filters by course

The table exposes stable column names and one parameter per row.

Tables give agents a consistent shape to parse: column headers as keys, rows as entries. Every query parameter, every request body field gets a row.

## Curl examples with real values

Every request example should use working values from the seed file. Avoid placeholders such as `"string"`, `"example"`, and `"YOUR_VALUE_HERE"`.

```bash
curl -X POST "http://localhost:3000/api/feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "courseSlug": "hiit-training",
    "lessonSlug": "warmup",
    "rating": 5,
    "comment": "The technique demo was incredibly helpful.",
    "author": "Alex Turner"
  }'
```

An agent may copy example values into a request. Seed data demonstrates the required format, casing, and data types with a request that can run unchanged.

\*\*Warning: Placeholder values are landmines\*\*

Agents treat example values as templates. If your curl example uses `"example-slug"`, an agent might send that exact string to your API. Use values from your actual seed data so the examples work when copied verbatim.

## Complete response bodies

Show the full JSON response for every endpoint. No `...` or "and so on." Truncated examples teach agents to generate truncated requests.

```json
{
  "id": "fb-001",
  "courseSlug": "knife-skills",
  "lessonSlug": "the-claw-grip",
  "rating": 5,
  "comment": "Finally understand why my onion cuts were uneven. The claw grip changed everything.",
  "author": "Priya Sharma",
  "createdAt": "2026-03-01T10:30:00Z"
}
```

Complete response examples teach the agent the full data shape.

## Exhaustive error documentation

Every error response gets its own block with the status code, the condition that triggers it, and the exact response body.

```markdown
**Error response (400), missing fields:**

\`\`\`json
{
  "error": "Missing required fields: courseSlug, lessonSlug, rating, comment, author"
}
\`\`\`

**Error response (400), invalid rating:**

\`\`\`json
{
  "error": "Rating must be a number between 1 and 5"
}
\`\`\`
```

The label `Error response (STATUS), DESCRIPTION:` identifies the status code and trigger condition. Document each response shape so a client can handle failures programmatically.

## A schema section

Parameter tables tell agents what an endpoint accepts. A schema section tells them the shape of every data type in the system.

```markdown
## Schema

### Feedback

| Field       | Type   | Description                              |
|-------------|--------|------------------------------------------|
| id          | string | Unique identifier (e.g. "fb-001")        |
| courseSlug  | string | Slug of the course                       |
| lessonSlug  | string | Slug of the lesson                       |
| rating      | number | Integer from 1 to 5                      |
| comment     | string | Feedback text                            |
| author      | string | Name of the person                       |
| createdAt   | string | ISO 8601 timestamp                       |
```

The schema section defines each field across the API, while endpoint tables identify which fields a request accepts. Together, they provide the information needed to construct valid requests.

Include format hints ("ISO 8601 timestamp"), value constraints ("Integer from 1 to 5"), and example values where helpful. The agent doesn't read your TypeScript types. It reads the docs.

## Workflow examples

The preceding patterns explain individual endpoints. Many tasks require a sequence of calls.

To find the worst-performing lessons in a course, an agent must check the summary, filter low ratings, and fetch the relevant details. A workflow documents that order directly.

Workflow examples show agents how endpoints chain together to accomplish a task:

```markdown
## Workflows

### Investigate low-rated feedback for a course

1. `GET /api/feedback/summary?courseSlug=hiit-training`: check the average rating and total entries
2. `GET /api/feedback?courseSlug=hiit-training&minRating=1`: pull all entries (minRating sets the floor, so 1 returns everything)
3. `GET /api/feedback/fb-003`: get the full details on a specific entry

### Submit and verify new feedback

1. `POST /api/feedback`: submit the feedback entry with all required fields
2. `GET /api/feedback/:id`: fetch the newly created entry using the `id` from the POST response
3. `GET /api/feedback/summary?courseSlug=relax-training`: check updated stats for the course
```

Each step names the endpoint, the key parameters, and why you're making that call. The numbered sequence removes all ambiguity about what comes first.

Endpoint docs explain how to make one call. Workflows explain how several calls accomplish a task.

\*\*Note: Workflows are task-oriented\*\*

Start with tasks someone would perform with the API. A workflow connects the required endpoints in the order needed to finish one of those tasks.

## Documentation for both audiences

Structured examples and explicit error cases also help human developers. The same documentation can serve both audiences.

\*\*Note: Better for humans too\*\*

Consistent formatting, realistic examples, and complete error documentation reduce guesswork for any API consumer.


