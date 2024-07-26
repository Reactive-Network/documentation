import React, { useState } from 'react';
import clsx from 'clsx';
import { useThemeConfig, usePrismTheme } from '@docusaurus/theme-common';
import {
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
  containsLineNumbers,
  useCodeWordWrap,
} from '@docusaurus/theme-common/internal';
import { Highlight } from 'prism-react-renderer';
import Line from '@theme/CodeBlock/Line';
import CopyButton from '@theme/CodeBlock/CopyButton';
import WordWrapButton from '@theme/CodeBlock/WordWrapButton';
import Container from '@theme/CodeBlock/Container';
import styles from './styles.module.css';
// Prism languages are always lowercase
// We want to fail-safe and allow both "php" and "PHP"
// See https://github.com/facebook/docusaurus/issues/9012
function normalizeLanguage(language) {
  return language?.toLowerCase();
}
export default function CodeBlockString({
  children,
  className: blockClassName = '',
  metastring,
  title: titleProp,
  showLineNumbers: showLineNumbersProp,
  language: languageProp,
}) {
  const {
    prism: { defaultLanguage, magicComments },
  } = useThemeConfig();
  const language = normalizeLanguage(
    languageProp ?? parseLanguage(blockClassName) ?? defaultLanguage,
  );
  const prismTheme = usePrismTheme();
  const wordWrap = useCodeWordWrap();
  const [isInline, setIsInline] = useState(true);
  // We still parse the metastring in case we want to support more syntax in the
  // future. Note that MDX doesn't strip quotes when parsing metastring:
  // "title=\"xyz\"" => title: "\"xyz\""
  const title = parseCodeBlockTitle(metastring) || titleProp;
  const { lineClassNames, code } = parseLines(children, {
    metastring,
    language,
    magicComments,
  });
  const showLineNumbers =
    showLineNumbersProp ?? containsLineNumbers(metastring);
  return (
    <Container
      as="div"
      className={clsx(
        // blockClassName,
        language &&
        !blockClassName.includes(`language-${language}`) &&
        `language-${language}`,
      )}
    >
      {(!containsAnnotate(metastring) && title) &&
        <div className={styles.roundedTop} style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", borderBottom: "1px solid var(--ifm-color-emphasis-300)", background: "var(--prism-background-color)" }}>
          <div className={styles.codeBlockTitle} style={{ display: "flex", alignItems: "center" }}>
            {title}
          </div>
          <div style={{ padding: "0.75rem var(--ifm-pre-padding)", marginLeft: "auto" }}>
            <div className={styles.buttonGroupAlter}>
              {(wordWrap.isEnabled || wordWrap.isCodeScrollable) && (
                <WordWrapButton
                  className={styles.codeButton}
                  onClick={() => wordWrap.toggle()}
                  isEnabled={wordWrap.isEnabled}
                />
              )}
              <CopyButton className={styles.codeButton} code={code} />
            </div>
          </div>
        </div>
      }
      {(containsAnnotate(metastring) && title) &&
        <div className={clsx({ [styles.smGridCols2]: isInline })} style={{ display: "grid" }}>
          <div className={clsx(styles.codeBlockTitle, styles.roundedTop)} style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--ifm-color-emphasis-300)", background: "var(--prism-background-color)" }}>
            {title}
            <div className={styles.buttonGroupAlter}>
              {containsAnnotate(metastring) &&
                <button type="button" aria-label="Change View" title="Change View" className="clean-btn" onClick={() => setIsInline(!isInline)}>
                  {isInline ?
                    <span className="" aria-hidden="true">Inline</span>
                    :
                    <span className="" aria-hidden="true">Beside</span>
                  }
                </button>
              }
              {((wordWrap.isEnabled) || wordWrap.isCodeScrollable) && (
                !isInline &&
                  <WordWrapButton
                    className={styles.codeButton}
                    onClick={() => wordWrap.toggle()}
                    isEnabled={wordWrap.isEnabled}
                  />
              )}
              <CopyButton className={styles.codeButton} code={code} />
            </div>
          </div>
          {isInline &&
            <div style={{}}></div>
          }
        </div>
      }
      {containsAnnotate(metastring) && isInline ? (
        <div className={styles.codeBlockContent}>
          <Highlight theme={prismTheme} code={code} language={language ?? 'text'}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <div
                /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
                tabIndex={0}
                ref={wordWrap.codeBlockRef}
                className={clsx(className, styles.codeBlock, 'thin-scrollbar')}
              >
                {splitArrayByComments(tokens).map((group, i) => (
                  <pre key={i} className={clsx(styles.hoverBorder)} style={{ padding: '0px', marginBottom: '0px', background: "transparent", borderRadius: "0px" }}>
                    <div className={clsx({ [styles.smGridCols2]: isInline })} style={{ display: "grid" }}>
                      <code
                        className={clsx(
                          { [styles.roundedBottom]: splitArrayByComments(tokens).length == i + 1 },
                          styles.codeBlockLines,
                          showLineNumbers && styles.codeBlockLinesWithNumbering,
                        )}
                        style={{ background: "var(--prism-background-color)", whiteSpace: "break-spaces", overflowWrap: "break-word", borderRadius: "0px" }}
                      >
                        <div>
                          {group.map((line, i) => (
                            line.types != "comment" &&
                            i != 1 && (
                              <Line
                                key={i}
                                line={line}
                                getLineProps={getLineProps}
                                getTokenProps={getTokenProps}
                                classNames={lineClassNames[i]}
                                showLineNumbers={showLineNumbers}
                              />
                            )
                          ))}
                        </div>
                      </code>
                      <div style={{ padding: "var(--ifm-pre-padding)", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                        <MarkdownComponent markdownText={group[0].content ?? ''} />
                      </div>
                    </div>
                  </pre>
                ))}
              </div>
            )}
          </Highlight>
        </div>
      ) : (
        <div className={styles.codeBlockContent}>
          <Highlight theme={prismTheme} code={code} language={language ?? 'text'}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
                tabIndex={0}
                ref={wordWrap.codeBlockRef}
                className={clsx(className, styles.codeBlock, styles.roundedBottom, 'thin-scrollbar')}
                style={{ ...style, boxShadow: "var(--ifm-global-shadow-lw)", borderRadius: "0px" }}
              >
                <code
                  className={clsx(
                    styles.codeBlockLines,
                    showLineNumbers && styles.codeBlockLinesWithNumbering,
                  )}
                >
                  {tokens.map((line, i) => (
                    <Line
                      key={i}
                      line={line}
                      getLineProps={getLineProps}
                      getTokenProps={getTokenProps}
                      classNames={lineClassNames[i]}
                      showLineNumbers={showLineNumbers}
                    />
                  ))}

                </code>
              </pre>
            )}
          </Highlight>
        </div>
      )}
    </Container>
  );
}

function containsAnnotate(metastring) {
  return Boolean(metastring?.includes('annotate'));
}

const splitArrayByComments = (data) => {
  const result = [];
  let currentCommentGroup = null;
  let currentTextArray = [];

  data.forEach((group) => {
    group.forEach((item) => {
      if (item.types[0] === 'comment') {
        if (currentTextArray.length > 0) {
          if (currentCommentGroup === null) {
            currentCommentGroup = [currentTextArray]
          } else {
            currentCommentGroup.push(currentTextArray);
          }
          currentTextArray = [];
        }
        if (currentCommentGroup !== null) {
          if (currentCommentGroup[currentCommentGroup.length - 1][0].content.replace(/\s/g, "") === "") {
            currentCommentGroup.splice(-1);
            if (currentCommentGroup[currentCommentGroup.length - 1][0].content.replace(/\s/g, "") === "") {
              currentCommentGroup.splice(-1);
            }
          }
          result.push(currentCommentGroup);
        }
        currentCommentGroup = [item];
      } else {
        currentTextArray.push(item);
      }
    });

    if (currentTextArray.length > 0) {
      if (currentCommentGroup !== null) {
        currentCommentGroup.push(currentTextArray);
        currentTextArray = [];
      }
    }
  });

  if (currentCommentGroup !== null) {
    result.push(currentCommentGroup);
  }

  return result;
};

const simpleMarkdownToHtml = (markdown) => {
  let html = markdown;
  html = html.replace(/^\/\/ (.*$)/gim, '$1');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>');
  html = html.replace(/\*(.*)\*/gim, '<i>$1</i>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img alt="$1" src="$2" />');
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  html = html.replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>');
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^1\. (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  html = html.replace(/\n/gim, '<br />');
  return html;
};

const MarkdownComponent = ({ markdownText }) => {
  const htmlContent = simpleMarkdownToHtml(markdownText);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};

const getLocalStorageValue = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue !== null ? storedValue : defaultValue;
};

const setLocalStorageValue = (key, value) => {
  localStorage.setItem(key, value);
};