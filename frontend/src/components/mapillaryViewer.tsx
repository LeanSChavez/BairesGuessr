import { useEffect, useRef } from "react";
import { Box, Center, Text, VStack, Badge } from "@chakra-ui/react";
import { Viewer } from "mapillary-js";
import "mapillary-js/dist/mapillary.css";

interface MapillaryViewerProps {
  imageId: string | null;
}

export const MapillaryViewer = ({ imageId }: MapillaryViewerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<Viewer | null>(null);

  const accessToken = import.meta.env.VITE_MAPILLARY_TOKEN;
  const isMock = !imageId || imageId.includes("mock");

  useEffect(() => {
    if (!containerRef.current || isMock || !accessToken) return;

    if (!viewerRef.current) {
      viewerRef.current = new Viewer({
        accessToken,
        container: containerRef.current,
        imageId,
        component: { cover: false },
      });
    } else {
      viewerRef.current.moveTo(imageId).catch((err) => {
        console.error("Error moviendo visor Mapillary:", err);
      });
    }
  }, [imageId, isMock, accessToken]);

  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
        viewerRef.current = null;
      }
    };
  }, []);

  if (isMock) {
    return (
      <Center w="full" h="full" p={6} textAlign="center">
        <VStack spaceY={2}>
          <Badge colorPalette="orange">Imagen Mock en MongoDB</Badge>
          <Text fontWeight="semibold">ID actual: {imageId || "null"}</Text>
          <Text fontSize="sm" color="gray.400">
            Actualizá el campo mapillary_id en MongoDB con un ID real para ver la vista 360°.
          </Text>
        </VStack>
      </Center>
    );
  }

  return <Box ref={containerRef} w="full" h="full" minH="400px" />;
};