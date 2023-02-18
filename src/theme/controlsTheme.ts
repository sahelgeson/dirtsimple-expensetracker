import { defineStyleConfig } from "@chakra-ui/react";
import defaultTheme from "@chakra-ui/theme";
import { StyleFunctionProps } from "@chakra-ui/theme-tools"

/* 
  Chakra UI is not as extensible as I thought, particularly the variants
  (like darkerBorder below). For variants it completely clears out all css,
  that's why I have to spread ...defaultTheme.components.Select.variants?.outline(props),
  to retain the original styles (outline is default). So I couldn't just do
  borderColor: 'gray.300', because there would be no other border css styles

  In general it doesn't seem to lend itself to sharing common "chunks" of 
  reusable css, at least not with the recommended setup. 

  TODO: redo this whole thing, sx would be easiest, but look into chakra's __css
  other options. All of those look simpler than this
*/

const xlgTheme = {
    fontSize: 'xlg',
    lineHeight: 'normal',
    px: 8,
    py: 4,
    borderRadius: 'md',
    backgroundColor: 'white',
};

export const buttonTheme = defineStyleConfig({
  baseStyle: (props: StyleFunctionProps) => ({
    /* on mobile :hover state "sticks" after tap, this does what Chakra should be doing and not keep that style on mobile */
    "@media(hover: none)": {
      _hover: {
        bg: defaultTheme.components.Button.variants?.solid(props).bg,
      },
    },
  }),
  sizes: {
    xlg: {
      ...xlgTheme,
    },
  },
  variants: {
    success: (props: StyleFunctionProps) => ({
      ...defaultTheme.components.Button.variants?.solid(props),
      bg: 'green.600',
      _disabled: {
        ...defaultTheme.components.Button.baseStyle?._disabled,
        _hover: {
          ...defaultTheme.components.Button.baseStyle?._disabled,
        }
      },
    }),
    _disabled: {
      ...defaultTheme.components.Button.baseStyle?._disabled,
      _hover: {
        ...defaultTheme.components.Button.baseStyle?._disabled,
      }
    },
  }
});

export const selectTheme = defineStyleConfig({
  sizes: {
    xlg: {
      field:  {
        ...xlgTheme,
      },
      icon: {
        right: 4,              
      }
    }
  },
  variants: {
    darkerBorder: (props: StyleFunctionProps) => ({
      ...defaultTheme.components.Select.variants?.outline(props),
      field: {
        ...defaultTheme.components.Select.variants?.outline(props).field,
        borderColor: "gray.300",
      },
    })
  }
});

export const inputTheme = defineStyleConfig({
  sizes: {
    xlg: {
      field:  {
        ...xlgTheme,
      },
    },
  },
  variants: {
    darkerBorder: (props: StyleFunctionProps) => ({
      ...defaultTheme.components.Input.variants?.outline(props),
      field: {
        ...defaultTheme.components.Input.variants?.outline(props).field,
        borderColor: "gray.300",
      },
    })
  },
});

export const numberInputTheme = defineStyleConfig({
  sizes: {
    xlg: {
      field:  {
        ...xlgTheme,
        px: 8,
        textAlign: 'center',
      },
    }
  },
  variants: {
    darkerBorder: (props: StyleFunctionProps) => ({
      ...defaultTheme.components.Input.variants?.outline(props),
      field: {
        ...defaultTheme.components.Input.variants?.outline(props).field,
        borderColor: "gray.300",
      },
    })
  },
});
