import { useFeatureSupport } from "@canva/app-hooks";
import { Button, Rows, Select, Text, TextInput, Title } from "@canva/app-ui-kit";
import {
  addElementAtCursor,
  addElementAtPoint,
  addPage,
  type TextElementAtPoint,
} from "@canva/design";
import { useState } from "react";
import * as styles from "styles/components.css";
import { LIBRARY, type Page } from "../../library";

const SUBJECTS = [
  { value: "sci", label: "מדעים" },
  { value: "math", label: "חשבון" },
  { value: "heb", label: "שפה (עברית)" },
  { value: "eng", label: "אנגלית" },
  { value: "art", label: "אומנות" },
];
const GRADES = ["ב", "ג", "ד", "ה"];

export const App = () => {
  const isSupported = useFeatureSupport();
  const addText = [addElementAtPoint, addElementAtCursor].find((fn) =>
    isSupported(fn),
  );
  const canAddPage = isSupported(addPage);

  const [subject, setSubject] = useState("sci");
  const [topic, setTopic] = useState("מחזור המים");
  const [grade, setGrade] = useState("ד");

  const data = LIBRARY[topic.trim()];
  const sentences = data
    ? grade === "ד" || grade === "ה"
      ? data.sentences.high
      : data.sentences.low
    : [];

  const insertText = (text: string) => {
    addText?.({ type: "text", children: [text] });
  };

  const insertPage = async (p: Page) => {
    const title: TextElementAtPoint = {
      type: "text",
      children: [p.title],
      top: 120,
      left: 160,
      width: 1600,
      fontSize: 80,
      fontWeight: "bold",
      textAlign: "start",
    };
    const body: TextElementAtPoint = {
      type: "text",
      children: [p.body],
      top: 360,
      left: 160,
      width: 1600,
      fontSize: 48,
      textAlign: "start",
    };
    await addPage({ title: p.title, elements: [title, body] });
  };

  return (
    <div className={styles.scrollContainer} dir="rtl" lang="he">
      <Rows spacing="2u">
        <Title size="small">עוזר נושא</Title>

        <Rows spacing="1u">
          <Text size="small">תחום</Text>
          <Select
            options={SUBJECTS}
            value={subject}
            onChange={setSubject}
            stretch
          />
        </Rows>

        <Rows spacing="1u">
          <Text size="small">נושא (בדוגמה: מחזור המים, חלקי הצמח)</Text>
          <TextInput value={topic} onChange={setTopic} placeholder="כתבו נושא" />
        </Rows>

        <Rows spacing="1u">
          <Text size="small">כיתה</Text>
          {GRADES.map((g) => (
            <Button
              key={g}
              variant={g === grade ? "primary" : "secondary"}
              onClick={() => setGrade(g)}
              stretch
            >
              {"כיתה " + g}
            </Button>
          ))}
        </Rows>

        {!data && (
          <Text size="small">
            אין עדיין הצעות לנושא הזה. נסו "מחזור המים" או "חלקי הצמח".
          </Text>
        )}

        {data && (
          <>
            <Title size="xsmall">עמודים מוכנים</Title>
            {data.pages.map((p) => (
              <Button
                key={p.title}
                variant="secondary"
                onClick={() => insertPage(p)}
                disabled={!canAddPage}
                stretch
              >
                {p.title}
              </Button>
            ))}

            <Title size="xsmall">משפטים לכיתה {grade}</Title>
            {sentences.map((s) => (
              <Button
                key={s}
                variant="secondary"
                onClick={() => insertText(s)}
                disabled={!addText}
                stretch
              >
                {s}
              </Button>
            ))}

            <Title size="xsmall">שאלות לכיתה</Title>
            {data.questions.map((q) => (
              <Button
                key={q}
                variant="secondary"
                onClick={() => insertText(q)}
                disabled={!addText}
                stretch
              >
                {q}
              </Button>
            ))}

            <Title size="xsmall">מילות מפתח</Title>
            {data.words.map((w) => (
              <Button
                key={w}
                variant="tertiary"
                onClick={() => insertText(w)}
                disabled={!addText}
                stretch
              >
                {w}
              </Button>
            ))}
          </>
        )}
      </Rows>
    </div>
  );
};
