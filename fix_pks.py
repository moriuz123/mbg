with open('src/db/schema.ts', 'r') as f:
    content = f.read()

# Fix text PKs back
content = content.replace('text("id").primaryKey().generatedAlwaysAsIdentity()', 'text("id").primaryKey()')
# Make sure integer PKs are correct (they currently have .generatedAlwaysAsIdentity())

with open('src/db/schema.ts', 'w') as f:
    f.write(content)
