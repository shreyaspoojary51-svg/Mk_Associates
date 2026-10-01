import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import {
  calculateEstimate,
  TIERS,
  ADDONS,
  type EstimateInput,
} from "@/lib/estimate";
import type { DesignBrief } from "@/lib/lead-schema";

import path from "node:path";
import { existsSync } from "node:fs";

// Disable automatic syllabic hyphenation: prevents awkward breaks and bypasses external hyphenate dictionary exports
Font.registerHyphenationCallback((word) => [word]);

const localRegular = path.resolve(process.cwd(), "public/fonts/Roboto-Regular.ttf");
const localBold = path.resolve(process.cwd(), "public/fonts/Roboto-Medium.ttf");

Font.register({
  family: "Roboto",
  fonts: [
    {
      src:
        typeof window === "undefined" && existsSync(localRegular)
          ? localRegular
          : "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src:
        typeof window === "undefined" && existsSync(localBold)
          ? localBold
          : "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 44,
    backgroundColor: "#faf8f4",
    fontFamily: "Roboto",
    color: "#252e29",
    fontSize: 11,
    lineHeight: 1.5,
  },
  brand: { fontSize: 12, letterSpacing: 3, marginBottom: 28, fontWeight: "bold" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    lineHeight: 1.2,
    marginBottom: 12,
  },
  subtitle: { color: "#62685e", marginBottom: 16 },
  heading: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    lineHeight: 1.3,
  },
  total: {
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 1.2,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#dcded4",
  },
  note: { marginTop: 18, color: "#62685e", fontSize: 10, lineHeight: 1.4 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 44,
    right: 44,
    color: "#62685e",
    fontSize: 10,
    lineHeight: 1.4,
  },
});
const money = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;
export default function ProposalDocument({
  estimate,
  brief,
}: {
  estimate?: EstimateInput;
  brief?: DesignBrief;
}) {
  const result = estimate ? calculateEstimate(estimate) : null;
  const rowStyle =
    result && result.addonLines.length > 5
      ? [styles.row, { paddingVertical: 2 }]
      : styles.row;
  return (
    <Document title="Your interior planning brief" author="MK Associates">
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>MK ASSOCIATES / INTERIORS</Text>
        <Text style={styles.title}>A considered beginning.</Text>
        <Text style={styles.subtitle}>
          Your personal planning brief. A starting point for a conversation, not
          a quotation.
        </Text>
        {brief && (
          <View>
            <Text style={styles.heading}>YOUR DESIGN DIRECTION</Text>
            {[
              ["Room", brief.room],
              ["Palette", brief.palette],
              ["Material", brief.material],
            ].map(([label, value]) => (
              <View style={rowStyle} key={label}>
                <Text>{label}</Text>
                <Text>{value}</Text>
              </View>
            ))}
          </View>
        )}
        {estimate && result && (
          <View>
            <Text style={styles.heading}>YOUR INDICATIVE ESTIMATE</Text>
            <Text style={styles.total}>
              {money(result.low)} - {money(result.high)}
            </Text>
            <Text>
              {estimate.propertyType} / {result.area} sq ft /{" "}
              {TIERS[estimate.tier].label}
            </Text>
            <View style={rowStyle}>
              <Text>
                Base interiors ({money(TIERS[estimate.tier].rate)} / sq ft)
              </Text>
              <Text>{money(result.base)}</Text>
            </View>
            {result.addonLines.map((line) => (
              <View key={line.key} style={rowStyle}>
                <Text>{ADDONS[line.key].label}</Text>
                <Text>{money(line.amount)}</Text>
              </View>
            ))}
            <View style={rowStyle}>
              <Text>Planning midpoint</Text>
              <Text>{money(result.total)}</Text>
            </View>
            <Text style={styles.heading}>INDICATIVE PAYMENT MILESTONES</Text>
            {result.milestones.map((m) => (
              <View style={rowStyle} key={m.label}>
                <Text>
                  {m.label} / {m.percent}%
                </Text>
                <Text>{money(m.amount)}</Text>
              </View>
            ))}
            <Text style={styles.note}>
              Indicative execution: 90-140 days after design sign-off and site
              readiness. Range includes a +/-15% planning contingency; it is not
              a guaranteed price. Taxes, appliances, loose furniture, statutory
              fees and society deposits are excluded. Scope, site conditions and
              material choices are confirmed after a survey. Milestones are
              illustrative and subject to contract.
            </Text>
          </View>
        )}
        {!estimate && (
          <Text style={styles.note}>
            This direction is an inspiration reference, not a specification.
            Materials, availability, dimensions and pricing will be confirmed
            during design consultation.
          </Text>
        )}
        <Text style={styles.footer}>
          MK Associates | Personal planning brief |{" "}
          {new Date().toISOString().slice(0, 10)}
        </Text>
      </Page>
    </Document>
  );
}
